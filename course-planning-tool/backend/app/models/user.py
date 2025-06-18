# This file now contains utility functions for referencing Supabase auth users
# The actual users table is managed by Supabase Auth (auth.users) with UUID primary keys

from sqlalchemy import text
from sqlalchemy.dialects.postgresql import UUID

# UUID type for referencing Supabase auth users
SUPABASE_USER_ID_TYPE = UUID(as_uuid=True)

# Reference to Supabase auth.users table
def get_auth_users_table():
    """
    Returns a reference to the Supabase auth.users table.
    This table is managed by Supabase and has UUID primary keys.
    """
    return "auth.users"

# Temporary stub for backwards compatibility
# TODO: Remove this once auth endpoints are updated to use Supabase Auth
class User:
    """Stub class for backwards compatibility. Use Supabase Auth instead."""
    def __init__(self):
        raise NotImplementedError("Use Supabase Auth instead of User model") 