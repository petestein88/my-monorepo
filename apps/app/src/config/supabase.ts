import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://bwtoqfiiwmuvakjmqvve.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3dG9xZmlpd211dmFram1xdnZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2NjQ5MzcsImV4cCI6MjA4NjI0MDkzN30.LheGJFGwbUrvRHV0HRTZFy1zzdDrBm6ln6ofjieQR4o'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
