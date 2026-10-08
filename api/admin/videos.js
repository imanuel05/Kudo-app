const { authorizeAdmin, respondUnauthorized } = require('../../lib/admin');
const {
  parseJsonBody,
  sendJson,
  supabaseRequest,
} = require('../../lib/payments');

const VIDEO_LIMIT_BYTES = 100 * 1024 * 1024;

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
        select: 'id,category,show_title,episode_title,episode_number,video_path,created_at',
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
    if (
      !['anime', 'kdrama'].includes(category)
      || showTitle.length < 1
      || showTitle.length > 100
      || episodeTitle.length < 1
      || episodeTitle.length > 120
      || !Number.isInteger(episodeNumber)
      || episodeNumber < 1
      || episodeNumber > 9999
    ) {
      return sendJson(response, 400, { error: 'Judul, kategori, atau episode tidak valid.' });
    }

    const pathPattern = new RegExp(`^${access.user.id}/[0-9a-f-]{36}\\.(mp4|webm)$`, 'i');
    if (!pathPattern.test(videoPath)) {
      return sendJson(response, 400, { error: 'Lokasi file video tidak valid.' });
    }
    const encodedPath = videoPath.split('/').map(encodeURIComponent).join('/');
    const objectInfo = await supabaseRequest(`/storage/v1/object/info/catalog-videos/${encodedPath}`);
    const metadata = objectInfo?.metadata || {};
    if (
      !['video/mp4', 'video/webm'].includes(metadata.mimetype)
      || Number(metadata.size) <= 0
      || Number(metadata.size) > VIDEO_LIMIT_BYTES
    ) {
      return sendJson(response, 400, { error: 'Video harus berupa MP4/WebM maksimal 100 MB.' });
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
        published: true,
      }),
    });
    if (!Array.isArray(videos) || videos.length !== 1) {
      throw new Error('Video catalog record was not returned.');
    }
    return sendJson(response, 201, { video: videos[0] });
  } catch (error) {
    console.error('Admin video catalog request failed:', error);
    return sendJson(response, 500, { error: 'Data video tidak dapat diproses.' });
  }
};
