import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const institutionName = searchParams.get('institution')
    
    console.log('🏫 Querying courses by institution...')
    
    // Get all courses with their institution information
    let query = supabaseAdmin
      .from('courses')
      .select(`
        id,
        course_code,
        course_name,
        units,
        category,
        subject_area,
        transferable,
        institution_id,
        institution_name,
        institutions!inner (
          name,
          short_name,
          type,
          system_name
        )
      `)
      .order('subject_area')
      .order('course_code')

    // Filter by institution if specified
    if (institutionName) {
      query = query.ilike('institution_name', `%${institutionName}%`)
    }

    const { data: courses, error } = await query

    if (error) {
      console.error('❌ Database error getting courses:', error)
      return NextResponse.json({ 
        success: false, 
        error: error.message 
      }, { status: 500 })
    }

    // Group courses by institution
    const coursesByInstitution = courses?.reduce((acc, course) => {
      const institutionName = course.institution_name || 'Unknown'
      
      if (!acc[institutionName]) {
        acc[institutionName] = {
          institution: {
            name: course.institutions?.name || institutionName,
            short_name: course.institutions?.short_name || '',
            type: course.institutions?.type || '',
            system_name: course.institutions?.system_name || ''
          },
          courses: []
        }
      }
      
      acc[institutionName].courses.push({
        id: course.id,
        code: course.course_code,
        name: course.course_name,
        units: course.units,
        category: course.category,
        subject: course.subject_area,
        transferable: course.transferable
      })
      
      return acc
    }, {} as Record<string, any>) || {}

    // Calculate statistics
    const stats = {
      totalCourses: courses?.length || 0,
      totalInstitutions: Object.keys(coursesByInstitution).length,
      transferableCourses: courses?.filter(c => c.transferable).length || 0,
      coursesByType: courses?.reduce((acc, course) => {
        const type = course.institutions?.type || 'unknown'
        acc[type] = (acc[type] || 0) + 1
        return acc
      }, {} as Record<string, number>) || {},
      coursesBySubject: courses?.reduce((acc, course) => {
        const subject = course.subject_area || 'unknown'
        acc[subject] = (acc[subject] || 0) + 1
        return acc
      }, {} as Record<string, number>) || {}
    }

    console.log(`✅ Found ${stats.totalCourses} courses across ${stats.totalInstitutions} institutions`)

    return NextResponse.json({
      success: true,
      message: `Found ${stats.totalCourses} courses${institutionName ? ` at ${institutionName}` : ''}`,
      data: {
        coursesByInstitution,
        statistics: stats,
        filter: institutionName || 'all'
      }
    })

  } catch (error) {
    console.error('❌ Failed to get courses by institution:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to get courses',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// GET specific institution's courses
export async function POST(request: Request) {
  try {
    const { institutionId } = await request.json()
    
    console.log(`🏫 Getting courses for institution ID: ${institutionId}`)
    
    const { data: courses, error } = await supabaseAdmin
      .from('courses')
      .select(`
        *,
        institutions!inner (
          name,
          short_name,
          type
        )
      `)
      .eq('institution_id', institutionId)
      .order('subject_area')
      .order('course_code')

    if (error) {
      console.error('❌ Database error getting courses by institution ID:', error)
      return NextResponse.json({ 
        success: false, 
        error: error.message 
      }, { status: 500 })
    }

    const institutionInfo = courses?.[0]?.institutions || null

    return NextResponse.json({
      success: true,
      message: `Found ${courses?.length || 0} courses`,
      data: {
        institution: institutionInfo,
        courses: courses?.map(course => ({
          id: course.id,
          code: course.course_code,
          name: course.course_name,
          units: course.units,
          category: course.category,
          subject: course.subject_area,
          description: course.description,
          prerequisites: course.prerequisites,
          transferable: course.transferable,
          typical_quarters: course.typical_quarters
        })) || []
      }
    })

  } catch (error) {
    console.error('❌ Failed to get courses by institution ID:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to get courses',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 