
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://verxelysubqjqdosyref.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZlcnhlbHlzdWJxanFkb3N5cmVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTMxMTU3NzMsImV4cCI6MjAyODY5MTc3M30.Cl8wgZo-VF0jR4-dqTLxf2ZPlC1axdKqiTvjUYGsz2g';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);
