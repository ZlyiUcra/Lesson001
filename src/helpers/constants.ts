// fields to be excluded from final set
export const projection = {_id: 0, __v: 0};
export const projectionExcludePostId = {postId: 0, ...projection};