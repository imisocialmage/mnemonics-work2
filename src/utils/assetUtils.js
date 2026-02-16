import { supabase } from './supabaseClient';

/**
 * Uploads an image to the ai_assets storage bucket.
 * @param {File} file - The file to upload
 * @param {string} userId - User ID for the folder structure
 * @returns {Promise<string>} - The public URL of the uploaded image
 */
export const uploadAssetImage = async (file, userId) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    const { error: uploadError } = await supabase.storage
        .from('ai_assets')
        .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
        .from('ai_assets')
        .getPublicUrl(filePath);

    return publicUrl;
};

/**
 * Saves generated asset metadata to the database.
 * @param {Object} assetData - The asset data to save
 * @returns {Promise<Object>} - The saved record
 */
export const saveAiAsset = async (assetData) => {
    const { data, error } = await supabase
        .from('ai_assets')
        .insert([assetData])
        .select()
        .single();

    if (error) throw error;
    return data;
};

/**
 * Fetches assets for a specific user and profile.
 * @param {string} userId 
 * @param {number} profileIndex 
 */
export const fetchUserAssets = async (userId, profileIndex) => {
    const { data, error } = await supabase
        .from('ai_assets')
        .select('*')
        .eq('user_id', userId)
        .eq('profile_index', profileIndex)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
};
