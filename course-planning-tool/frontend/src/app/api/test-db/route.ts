import { NextResponse } from 'next/server'
import { DatabaseService } from '@/services/databaseService'

export async function GET() {
  try {
    console.log('🧪 Testing database connection...')
    
    // Test 1: Get institutions (should have sample data)
    const { institutions, error: institutionsError } = await DatabaseService.getInstitutions()
    
    if (institutionsError) {
      console.error('❌ Failed to get institutions:', institutionsError)
      return NextResponse.json({ 
        success: false, 
        error: institutionsError,
        step: 'institutions'
      }, { status: 500 })
    }

    // Test 2: Get majors (should have sample data)
    const { majors, error: majorsError } = await DatabaseService.getMajors()
    
    if (majorsError) {
      console.error('❌ Failed to get majors:', majorsError)
      return NextResponse.json({ 
        success: false, 
        error: majorsError,
        step: 'majors'
      }, { status: 500 })
    }

    // Test 3: Cleanup expired verifications (test function)
    const { deletedCount, error: cleanupError } = await DatabaseService.cleanupExpiredVerifications()
    
    if (cleanupError) {
      console.error('❌ Failed cleanup test:', cleanupError)
      // Don't fail the test for cleanup errors, just log them
      console.log('⚠️ Cleanup test failed, but continuing...')
    }

    console.log('✅ Database connection test successful!')
    
    return NextResponse.json({
      success: true,
      message: 'Database connection working perfectly!',
      data: {
        institutions: {
          count: institutions.length,
          sample: institutions.slice(0, 3).map(i => ({ name: i.name, type: i.type }))
        },
        majors: {
          count: majors.length,
          sample: majors.slice(0, 3).map(m => ({ name: m.name, category: m.category }))
        },
        cleanup: {
          expiredCodesDeleted: cleanupError ? 'failed' : deletedCount
        }
      },
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ Database test failed:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Database connection failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 