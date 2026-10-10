const { authorizeAdmin, respondUnauthorized } = require('../../lib/admin');
const {
  parseJsonBody,
  sendJson,
  supabaseRequest,
} = require('../../lib/payments');

const VIDEO_LIMIT_BYTES = 50 * 1024 * 1024;
const IMAGE_LIMIT_BYTES = 5 * 1024 * 1024;

function publicStorageUrl(path) {
  const encodedPath = path.split('/').map(encodeURIComponent).join('/');
  return `${process.env.SUPABASE_URL.replace(/\/+$/, '')}/storage/v1/object/public/catalog-video/${encodedPath}`;
}

async function validateStorageObject(path, allowedTypes, maxSize, label) {
  const encodedPath = path.split('/').map(encodeURIComponent).join('/');
  const objectInfo = await supabaseRequest(`/storage/v1/object/info/catalog-video/${encodedPath}`);
  const metadata = objectInfo?.metadata || {};
  if (
    !allowedTypes.includes(metadata.mimetype)
    || Number(metadata.size) <= 0
    || Number(metadata.size) > maxSize
  ) {
    const error = new Error(`${label} tidak valid.`);
    error.statusCode = 400;
    throw error;
  }
}

module.exports = async function adminVideos(request, response) {
  if (!['GET', 'POST'].includes(request.method)) {
    response.setHeader('Allow', 'GET, POST');
    return sendJson(response, 405, { error: 'Method not allowed.' });
  }

  try {
    const access = await authorizeAdmin(request);
    if (!access.user) return respondUnauthorized(response, access.status);

    if (request.method === 'GET') {
      const query = new URLSearchParams({
        select: 'id,category,show_title,episode_title,episode_number,video_path,video_url,created_at,folder_name,show_description,poster_path,poster_url,episode_poster_path,episode_poster_url,genres,show_type,episode_description,thumbnail_path,thumbnail_url',
        order: 'created_at.desc',
        limit: '100',
      });
      const videos = await supabaseRequest(`/rest/v1/catalog_videos?${query}`);
      if (!Array.isArray(videos)) throw new Error('Admin video list response was invalid.');
      return sendJson(response, 200, { videos });
    }

    const body = parseJsonBody(request.body);
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return sendJson(response, 400, { error: 'Data video tidak valid.' });
    }
    const category = String(body.category || '');
    const showTitle = String(body.showTitle || '').trim();
    const episodeTitle = String(body.episodeTitle || '').trim();
    const episodeNumber = Number(body.episodeNumber);
    const videoPath = String(body.videoPath || '');
    const folderName = String(body.folderName || '');
    const showDescription = String(body.showDescription || '').trim();
    const genres = Array.isArray(body.genres)
      ? body.genres.map((genre) => String(genre).trim()).filter(Boolean)
      : [];
    const showType = String(body.showType || 'Series');
    const episodeDescription = String(body.episodeDescription || '').trim();
    const posterPath = String(body.posterPath || '');
    const episodePosterPath = String(body.episodePosterPath || '');
    const thumbnailPath = String(body.thumbnailPath || '');
    if (
      !['anime', 'kdrama'].includes(category)
      || showTitle.length < 1
      || showTitle.length > 100
      || episodeTitle.length < 1
      || episodeTitle.length > 120
      || !Number.isInteger(episodeNumber)
      || episodeNumber < 1
      || episodeNumber > 9999
      || (folderName && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(folderName))
      || showDescription.length > 5000
      || (folderName && (!showDescription || !genres.length || !posterPath || !episodePosterPath || !thumbnailPath))
      || genres.length > 20
      || genres.some((genre) => genre.length > 40)
      || !['Series', 'Movie'].includes(showType)
      || episodeDescription.length > 5000
    ) {
      return sendJson(response, 400, { error: 'Metadata judul, kategori, atau episode tidak valid.' });
    }

    const pathPattern = folderName
      ? new RegExp(`^${access.user.id}/${folderName}/episodes/[0-9a-f-]{36}\\.(mp4|webm)$`, 'i')
      : new RegExp(`^${access.user.id}/[0-9a-f-]{36}\\.(mp4|webm)$`, 'i');
    if (!pathPattern.test(videoPath)) {
      return sendJson(response, 400, { error: 'Lokasi file video tidak valid.' });
    }
    const encodedPath = videoPath.split('/').map(encodeURIComponent).join('/');
    await validateStorageObject(videoPath, ['video/mp4', 'video/webm'], VIDEO_LIMIT_BYTES, 'Video harus berupa MP4/WebM maksimal 50 MB');
    if (posterPath) {
      const posterPattern = folderName
        ? new RegExp(`^[0-9a-f-]{36}/${folderName}/poster\\.(png|jpe?g|webp)$`, 'i')
        : null;
      if (!posterPattern?.test(posterPath)) {
        return sendJson(response, 400, { error: 'Lokasi poster tidak valid.' });
      }
      await validateStorageObject(posterPath, ['image/png', 'image/jpeg', 'image/webp'], IMAGE_LIMIT_BYTES, 'Poster harus PNG/JPG/WebP maksimal 5 MB');
    }
    if (episodePosterPath) {
      const episodePosterPattern = folderName
        ? new RegExp(`^${access.user.id}/${folderName}/episode-posters/[0-9a-f-]{36}\\.(png|jpe?g|webp)$`, 'i')
        : null;
      if (!episodePosterPattern?.test(episodePosterPath)) {
        return sendJson(response, 400, { error: 'Lokasi poster episode tidak valid.' });
      }
      await validateStorageObject(episodePosterPath, ['image/png', 'image/jpeg', 'image/webp'], IMAGE_LIMIT_BYTES, 'Poster episode harus PNG/JPG/WebP maksimal 5 MB');
    }
    if (thumbnailPath) {
      const thumbnailPattern = folderName
        ? new RegExp(`^${access.user.id}/${folderName}/thumbnails/episode-${episodeNumber}-[0-9a-f-]{36}\\.(png|jpe?g|webp)$`, 'i')
        : null;
      if (!thumbnailPattern?.test(thumbnailPath)) {
        return sendJson(response, 400, { error: 'Lokasi thumbnail tidak valid.' });
      }
      await validateStorageObject(thumbnailPath, ['image/png', 'image/jpeg', 'image/webp'], IMAGE_LIMIT_BYTES, 'Thumbnail harus PNG/JPG/WebP maksimal 5 MB');
    }

    const videos = await supabaseRequest('/rest/v1/catalog_videos', {
      method: 'POST',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify({
        category,
        show_title: showTitle,
        episode_title: episodeTitle,
        episode_number: episodeNumber,
        video_path: videoPath,
        video_url: publicStorageUrl(videoPath),
        ...(folderName ? { folder_name: folderName } : {}),
        ...(showDescription ? { show_description: showDescription } : {}),
        ...(posterPath ? { poster_path: posterPath, poster_url: publicStorageUrl(posterPath) } : {}),
        ...(episodePosterPath ? {
          episode_poster_path: episodePosterPath,
          episode_poster_url: publicStorageUrl(episodePosterPath),
        } : {}),
        ...(genres.length ? { genres } : {}),
        ...(showType ? { show_type: showType } : {}),
        ...(episodeDescription ? { episode_description: episodeDescription } : {}),
        ...(thumbnailPath ? { thumbnail_path: thumbnailPath, thumbnail_url: publicStorageUrl(thumbnailPath) } : {}),
        published: true,
      }),
    });
    if (!Array.isArray(videos) || videos.length !== 1) {
      throw new Error('Video catalog record was not returned.');
    }
    return sendJson(response, 201, { video: videos[0] });
  } catch (error) {
    console.error('Admin video catalog request failed:', error);
    return sendJson(response, error.statusCode || 500, { error: error.statusCode ? error.message : 'Data video tidak dapat diproses.' });
  }
};
