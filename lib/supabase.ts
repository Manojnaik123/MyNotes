import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://yvctddhttqofusinjscs.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2Y3RkZGh0dHFvZnVzaW5qc2NzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIzMTE4NDEsImV4cCI6MjA4Nzg4Nzg0MX0.fhUutDDUSFxjiZqgtFjJizrsVwwpWOS88MAaNXXNNEw'

export const supabase = createClient(supabaseUrl, supabaseKey)