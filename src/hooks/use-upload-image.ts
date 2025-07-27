import { useMutation } from '@tanstack/react-query'

import utilsApis from '~/apis/utils.apis'

export default function useUploadImage() {
  const uploadImageMutation = useMutation({
    mutationKey: ['upload-image'],
    mutationFn: utilsApis.uploadImage
  })
  return {
    uploadImageMutation
  }
}
