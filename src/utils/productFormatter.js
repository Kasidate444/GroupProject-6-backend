import { buildPreviewUrl } from './cloudinaryUpload.js';

export const formatArtist = (artist) => {
    if (!artist) return null;

    return {
        _id: artist._id,
        username: artist.username,
        name: artist.display_name || artist.username,
        display_name: artist.display_name,
        profile_picture: artist.profile_picture,
        profile_picture_url: artist.profile_picture?.url ?? null,
        bio: artist.bio,
        role: artist.role,
    };
};

export const formatTrack = (track) => {
    if (!track) return null;

    return {
        _id: track._id,
        artist_id: track.artist,
        title: track.title,
        duration_sec: track.durationSec,
        audio_file_url: track.audioUrl?.url ?? null,
        preview_url: track.audioUrl?.public_id
            ? buildPreviewUrl(
                track.audioUrl.public_id,
                track.previewStartSec,
                track.previewDurationSec,
            )
            : null,
        audio_url: track.audioUrl,
        preview_start_sec: track.previewStartSec,
        preview_duration_sec: track.previewDurationSec,
        is_streamable: track.isStreamable,
        created_at: track.createdAt,
        updated_at: track.updatedAt,
    };
};

export const formatProduct = (product) => {
    if (!product) return null;

    return {
        _id: product._id,
        artist_id: product.artist?._id ?? product.artist,
        artist: formatArtist(product.artist),
        type: product.type,
        merch_type: product.merchType,
        title: product.title,
        slug: product.slug,
        description: product.description,
        price: product.price,
        min_price: product.minPrice,
        stock: product.stock,
        cover_url: product.coverUrl?.url ?? null,
        cover: product.coverUrl,
        name_your_price: product.nameYourPrice,
        status: product.status,
        release_date: product.releaseDate,
        deleted_at: product.deletedAt,
        tracks: product.tracks?.map(formatTrack).filter(Boolean) ?? [],
        created_at: product.createdAt,
        updated_at: product.updatedAt,
    };
};


export const formatPublicTrack = (track) => {
    if (!track) return null;

    return {
      _id: track._id,
      artist_id: track.artist,
      title: track.title,
      duration_sec: track.durationSec,
      preview_url: track.audioUrl?.public_id
        ? buildPreviewUrl(
            track.audioUrl.public_id,
            track.previewStartSec,
            track.previewDurationSec,
          )
        : null,
      preview_start_sec: track.previewStartSec,
      preview_duration_sec: track.previewDurationSec,
      is_streamable: track.isStreamable,
    };
  };

  export const formatPublicProduct = (product) => {
    if (!product) return null;

    return {
      _id: product._id,
      artist_id: product.artist?._id ?? product.artist,
      artist: formatArtist(product.artist),
      type: product.type,
      merch_type: product.merchType,
      title: product.title,
      slug: product.slug,
      description: product.description,
      price: product.price,
      min_price: product.minPrice,
      stock: product.stock,
      cover_url: product.coverUrl?.url ?? null,
      name_your_price: product.nameYourPrice,
      status: product.status,
      release_date: product.releaseDate,
      tracks: product.tracks?.map(formatPublicTrack).filter(Boolean) ?? [],
      created_at: product.createdAt,
    };
  };


  export const formatOwnedTrack = (track) => {
    if (!track) return null;

    return {
      _id: track._id,
      artist_id: track.artist,
      title: track.title,
      duration_sec: track.durationSec,
      audio_file_url: track.audioUrl?.url ?? null,
      preview_url: track.audioUrl?.public_id
        ? buildPreviewUrl(
            track.audioUrl.public_id,
            track.previewStartSec,
            track.previewDurationSec,
          )
        : null,
    };
  };


  export const formatOwnedProduct = (product) => {
    if (!product) return null;

    return {
      _id: product._id,
      artist_id: product.artist?._id ?? product.artist,
      artist: formatArtist(product.artist),
      type: product.type,
      merch_type: product.merchType,
      title: product.title,
      slug: product.slug,
      description: product.description,
      price: product.price,
      min_price: product.minPrice,
      stock: product.stock,
      cover_url: product.coverUrl?.url ?? null,
      cover: product.coverUrl,
      name_your_price: product.nameYourPrice,
      status: product.status,
      release_date: product.releaseDate,
      tracks: product.tracks?.map(formatOwnedTrack).filter(Boolean) ?? [],
      purchased_at: product.purchasedAt,
      created_at: product.createdAt,
    };
  };