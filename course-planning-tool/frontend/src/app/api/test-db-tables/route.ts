import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-server';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Testing database tables and schemas...');

    // Test 1: Check auth.users (this should always exist)
    const { data: authUsers, error: authError } = await supabase.auth.getUser();
    console.log('Auth status:', authUsers ? 'Connected' : 'Not connected');

    // Test 2: Try to query each table the registration uses
    const tables = [
      'users',
      'email_verifications', 
      'academic_profiles',
      'dashboard_metrics',
      'user_activity_log'
    ];

    const results: any = {
      auth_connection: authUsers ? 'Connected' : 'Not connected',
      tables: {}
    };

    for (const table of tables) {
      try {
        const { data, error } = await supabase
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
            sample_count: data?.length || 0
          };
        }
      } catch (err) {
        results.tables[table] = {
          exists: false,
          error: err instanceof Error ? err.message : 'Unknown error'
        };
      }
    }

    // Test 3: Check what tables DO exist
    try {
      const { data: schemaData, error: schemaError } = await supabase
        .rpc('get_schema_info');
      
      if (schemaData) {
        results.available_tables = schemaData;
      }
    } catch (err) {
      console.log('Could not get schema info:', err);
    }

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