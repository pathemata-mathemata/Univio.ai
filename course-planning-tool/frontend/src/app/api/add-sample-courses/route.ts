import { NextResponse } from 'next/server'
import { DatabaseService } from '@/services/databaseService'

export async function POST() {
  try {
    console.log('🎓 Adding sample courses with institution tracking...')
    
    // First, get institutions to link courses to them
    const { institutions, error: institutionsError } = await DatabaseService.getInstitutions()
    
    if (institutionsError || !institutions.length) {
      return NextResponse.json({ 
        success: false, 
        error: 'No institutions found. Please ensure institutions are loaded first.'
      }, { status: 400 })
    }

    // Find specific institutions
    const deAnza = institutions.find(i => i.short_name === 'De Anza')
    const foothill = institutions.find(i => i.short_name === 'Foothill')
    const ucla = institutions.find(i => i.short_name === 'UCLA')
    const ucBerkeley = institutions.find(i => i.short_name === 'UC Berkeley')

    if (!deAnza || !foothill || !ucla || !ucBerkeley) {
      return NextResponse.json({ 
        success: false, 
        error: 'Required institutions not found'
      }, { status: 400 })
    }

    // Sample courses with clear institution tracking
    const sampleCourses = [
      // De Anza College Courses
      {
        course_code: 'MATH 1A',
        course_name: 'Calculus I',
        description: 'Differential calculus of functions of one variable',
        units: 5.0,
        institution_id: deAnza.id,
        institution_name: deAnza.name,
        category: 'Mathematics',
        subject_area: 'MATH',
        prerequisites: [],
        transferable: true,
        typical_quarters: ['fall', 'winter', 'spring']
      },
      {
        course_code: 'CS 1A',
        course_name: 'Object-Oriented Programming Methodologies in Java',
        description: 'Introduction to programming using Java',
        units: 4.5,
        institution_id: deAnza.id,
        institution_name: deAnza.name,
        category: 'Computer Science',
        subject_area: 'CS',
        prerequisites: [],
        transferable: true,
        typical_quarters: ['fall', 'winter', 'spring']
      },
      {
        course_code: 'ENGL 1A',
        course_name: 'Composition and Reading',
        description: 'Critical thinking and writing',
        units: 4.0,
        institution_id: deAnza.id,
        institution_name: deAnza.name,
        category: 'English',
        subject_area: 'ENGL',
        prerequisites: [],
        transferable: true,
        typical_quarters: ['fall', 'winter', 'spring']
      },

      // Foothill College Courses
      {
        course_code: 'MATH 1B',
        course_name: 'Calculus II',
        description: 'Integral calculus and infinite series',
        units: 5.0,
        institution_id: foothill.id,
        institution_name: foothill.name,
        category: 'Mathematics',
        subject_area: 'MATH',
        prerequisites: ['MATH 1A'],
        transferable: true,
        typical_quarters: ['fall', 'winter', 'spring']
      },
      {
        course_code: 'CS 2A',
        course_name: 'Object-Oriented Programming Methodologies in C++',
        description: 'Advanced programming concepts using C++',
        units: 4.5,
        institution_id: foothill.id,
        institution_name: foothill.name,
        category: 'Computer Science',
        subject_area: 'CS',
        prerequisites: ['CS 1A'],
        transferable: true,
        typical_quarters: ['fall', 'winter', 'spring']
      },

      // UCLA Courses (Upper Division)
      {
        course_code: 'CS 111',
        course_name: 'Operating Systems Principles',
        description: 'Introduction to operating systems design and evaluation',
        units: 4.0,
        institution_id: ucla.id,
        institution_name: ucla.name,
        category: 'Computer Science',
        subject_area: 'CS',
        prerequisites: ['CS 33', 'CS 35L'],
        transferable: false, // Upper division course
        typical_quarters: ['fall', 'winter', 'spring']
      },

      // UC Berkeley Courses
      {
        course_code: 'CS 61A',
        course_name: 'Structure and Interpretation of Computer Programs',
        description: 'Introduction to programming and computer science',
        units: 4.0,
        institution_id: ucBerkeley.id,
        institution_name: ucBerkeley.name,
        category: 'Computer Science',
        subject_area: 'CS',
        prerequisites: [],
        transferable: false, // University course
        typical_quarters: ['fall', 'spring']
      }
    ]

    // Add courses to database
    const addedCourses = []
    const errors = []

    for (const courseData of sampleCourses) {
      try {
        const { course, error } = await DatabaseService.addCourse(courseData)
        
        if (error) {
          errors.push(`${courseData.course_code}: ${error}`)
        } else {
          addedCourses.push({
            code: course?.course_code,
            name: course?.course_name,
            institution: course?.institution_name,
            units: course?.units
          })
        }
      } catch (err) {
        errors.push(`${courseData.course_code}: ${err}`)
      }
    }

    console.log(`✅ Added ${addedCourses.length} courses successfully`)
    if (errors.length > 0) {
      console.log(`⚠️ ${errors.length} errors occurred`)
    }

    return NextResponse.json({
      success: true,
      message: `Successfully added ${addedCourses.length} sample courses with institution tracking`,
      data: {
        coursesAdded: addedCourses.length,
        totalAttempted: sampleCourses.length,
        courses: addedCourses,
        errors: errors.length > 0 ? errors : undefined
      },
      institutionBreakdown: {
        'De Anza College': addedCourses.filter(c => c.institution?.includes('De Anza')).length,
        'Foothill College': addedCourses.filter(c => c.institution?.includes('Foothill')).length,
        'UCLA': addedCourses.filter(c => c.institution?.includes('UCLA')).length,
        'UC Berkeley': addedCourses.filter(c => c.institution?.includes('Berkeley')).length
      }
    })

  } catch (error) {
    console.error('❌ Failed to add sample courses:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to add sample courses',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 