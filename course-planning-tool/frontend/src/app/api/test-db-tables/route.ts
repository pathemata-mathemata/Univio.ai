import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Testing database tables and schemas...');

    // Test 1: Try to query each table the registration uses
    const tables = [
      'users',
      'email_verifications', 
      'academic_profiles',
      'dashboard_metrics',
      'user_activity_log'
    ];

    const results: any = {
      database_connection: 'Testing...',
      tables: {}
    };

    for (const table of tables) {
      try {
        const { data, error } = await supabaseAdmin
          .from(table)
          .select('*')
          .limit(1);

        if (error) {
          results.tables[table] = {
            exists: false,
            error: error.message,
            code: error.code
          };
        } else {
          results.tables[table] = {
            exists: true,
            sample_count: data?.length || 0,
            status: 'accessible'
          };
        }
      } catch (err) {
        results.tables[table] = {
          exists: false,
          error: err instanceof Error ? err.message : 'Unknown error'
        };
      }
    }

    // Test 2: Check auth.users table (Supabase built-in)
    try {
      const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers();
      results.auth_users = {
        accessible: !authError,
        user_count: authUsers?.users?.length || 0,
        error: authError?.message || null
      };
    } catch (err) {
      results.auth_users = {
        accessible: false,
        error: err instanceof Error ? err.message : 'Unknown error'
      };
    }

    results.database_connection = 'Connected';

    return NextResponse.json({
      success: true,
      message: 'Database table analysis complete',
      results
    });

  } catch (error) {
    console.error('❌ Database test error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Database test failed',
        message: 'Failed to test database tables'
      },
      { status: 500 }
    );
  }
} 