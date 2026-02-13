import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://okyhcmxemffjhmbcmmbi.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9reWhjbXhlbWZmamhtYmNtbWJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkyNjE0OTMsImV4cCI6MjA1NDgzNzQ5M30.YeVfH6fMx2aHBQBhsxWo6k4IQfmcVnK_4nymsuiSOQU'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
