import { useNavigation as useNavigationRN } from '@react-navigation/native';

export function useNavigation() {
  const { navigate, goBack } = useNavigationRN();

  function toFilePicker(previousUploadStatus?: string) {
    navigate({
      name: 'file-picker',
      params: { previousUploadStatus },
    });
  }

  function toScanner(contentUri: string) {
    navigate({
      name: 'scanner',
      params: { contentUri },
    });
  }

  function toUploader(uploadToken: string, contentUri: string) {
    navigate({
      name: 'uploader',
      params: { uploadToken, contentUri },
    });
  }

  return {
    toFilePicker,
    toScanner,
    toUploader,
    goBack,
  };
}
