import {
  AcquisitionType,
  DataSource,
  ImageInterface,
  MouseHoverImageOptions,
  SubjectType,
  WatermarkPositionOptions,
  WatermarkSizeOptions
} from "../interfaces/image.interface";

export class ImageGenerator {
  static image(source: Partial<ImageInterface> = {}): ImageInterface {
    return {
      user: source.user || 1,
      username: source.username || "astrobin",
      userDisplayName: source.userDisplayName || "AstroBin",
      userAvatar: source.userAvatar || "/media/avatars/astrobin.jpg",
      pendingCollaborators: source.pendingCollaborators || null,
      collaborators: source.collaborators || null,
      pk: source.pk || 1,
      hash: source.hash || "abc123",
      title: source.title || "Generated image",
      imageFile: source.imageFile || "/media/images/generated.jpg",
      videoFile: null,
      encodedVideoFile: null,
      loopVideo: null,
      isWip: source.isWip || false,
      isFinal: source.isFinal || true,
      skipNotifications: source.skipNotifications || false,
      w: source.w || 1000,
      h: source.h || 1000,
      imagingTelescopes: source.imagingTelescopes || [],
      imagingCameras: source.imagingCameras || [],
      guidingTelescopes: source.guidingTelescopes || [],
      guidingCameras: source.guidingCameras || [],
      focalReducers: source.focalReducers || [],
      mounts: source.mounts || [],
      accessories: source.accessories || [],
      software: source.software || [],
      imagingTelescopes2: source.imagingTelescopes2 || [],
      imagingCameras2: source.imagingCameras2 || [],
      guidingTelescopes2: source.guidingTelescopes2 || [],
      guidingCameras2: source.guidingCameras2 || [],
      mounts2: source.mounts2 || [],
      filters2: source.filters2 || [],
      accessories2: source.accessories2 || [],
      software2: source.software2 || [],
      uploaded: source.uploaded || new Date().toISOString(),
      published: source.published || new Date().toISOString(),
      license: "",
      description: undefined,
      descriptionBbcode: undefined,
      link: undefined,
      linkToFits: undefined,
      acquisitionType: AcquisitionType.REGULAR,
      subjectType: SubjectType.DEEP_SKY,
      solarSystemMainSubject: undefined,
      dataSource: DataSource.BACKYARD,
      remoteSource: undefined,
      partOfGroupSet: [],
      mouseHoverImage: MouseHoverImageOptions.SOLUTION,
      allowComments: true,
      squareCropping: `0,0,${source.w || 1000},${source.h || 1000}`,
      watermark: true,
      watermarkText: "Copyright AstroBin",
      watermarkPosition: WatermarkPositionOptions.CENTER,
      watermarkSize: WatermarkSizeOptions.MEDIUM,
      watermarkOpacity: 50,
      sharpenThumbnails: false,
      keyValueTags: null,
      locations: [],
      locationObjects: [],
      fullSizeDisplayLimitation: null,
      downloadLimitation: null,
      thumbnails: [],
      submittedForIotdTpConsideration: null,
      deepSkyAcquisitions: [],
      solarSystemAcquisitions: [],
      solution: null,
      revisions: [],
      constellation: source.constellation || null,
      likeCount: source.likeCount || 0,
      bookmarkCount: source.bookmarkCount || 0,
      commentCount: source.commentCount || 0,
      userFollowerCount: source.userFollowerCount || 0
    };
  }
}
