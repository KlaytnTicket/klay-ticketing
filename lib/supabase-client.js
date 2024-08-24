import { createClient } from '@supabase/supabase-js';

const projectURL = process.env.SUPABASE_PROJECT_URL;
const apiKey = process.env.SUPABASE_API_KEY;
const bucketName = process.env.SUPABASE_BUCKET_NAME;

export async function supabaseStorageUpsert(fileBody, filePath) {
  if (!projectURL || !apiKey || !bucketName) {
    return null;
  }

  const supabase = createClient(projectURL, apiKey);

  const { data, error } = await supabase.storage.from(bucketName).upload(filePath, fileBody, {
    upsert: true,
    contentType: 'image/*',
  });
  if (error) {
    return null;
  }

  const imageUrl = supabase.storage.from(bucketName).getPublicUrl(filePath);

  return { data, publicUrl: imageUrl.data.publicUrl };
}

export async function supabaseStorageDelete(filePath) {
  if (!projectURL || !apiKey || !bucketName) {
    return null;
  }

  const supabase = createClient(projectURL, apiKey);

  const { data, error } = await supabase.storage.from(bucketName).remove(filePath);
  if (error) {
    return null;
  }

  return { data };
}
