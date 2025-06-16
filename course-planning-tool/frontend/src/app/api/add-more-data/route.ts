import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'

export async function POST() {
  try {
    console.log('📊 Adding more sample data to database...')
    
    // Add more institutions
    const newInstitutions = [
      {
        name: 'California State University, San Francisco',
        short_name: 'SF State',
        type: 'university',
        system_name: 'CSU System',
        state: 'CA',
        assist_org_name: 'San Francisco State University'
      },
      {
        name: 'Ohlone College',
        short_name: 'Ohlone',
        type: 'community_college',
        system_name: 'California Community Colleges',
        state: 'CA',
        assist_org_name: 'Ohlone College'
      },
      {
        name: 'Mission College',
        short_name: 'Mission',
        type: 'community_college',
        system_name: 'California Community Colleges',
        state: 'CA',
        assist_org_name: 'Mission College'
      }
    ]

    // Add more majors
    const newMajors = [
      { name: 'Mechanical Engineering', category: 'STEM', typical_units: 128 },
      { name: 'Electrical Engineering', category: 'STEM', typical_units: 128 },
      { name: 'Civil Engineering', category: 'STEM', typical_units: 128 },
      { name: 'Marketing', category: 'Business', typical_units: 120 },
      { name: 'Finance', category: 'Business', typical_units: 120 },
      { name: 'Sociology', category: 'Social Sciences', typical_units: 120 }
    ]

    // Insert institutions
    const { data: institutionsData, error: institutionsError } = await supabaseAdmin
      .from('institutions')
      .insert(newInstitutions)
      .select()

    if (institutionsError) {
      console.error('❌ Error adding institutions:', institutionsError)
    } else {
      console.log(`✅ Added ${institutionsData?.length || 0} new institutions`)
    }

    // Insert majors
    const { data: majorsData, error: majorsError } = await supabaseAdmin
      .from('majors')
      .insert(newMajors)
      .select()

    if (majorsError) {
      console.error('❌ Error adding majors:', majorsError)
    } else {
      console.log(`✅ Added ${majorsData?.length || 0} new majors`)
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully added more sample data',
      data: {
        institutionsAdded: institutionsData?.length || 0,
        majorsAdded: majorsData?.length || 0,
        errors: {
          institutions: institutionsError?.message,
          majors: majorsError?.message
        }
      }
    })

  } catch (error) {
    console.error('❌ Failed to add more data:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to add data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 