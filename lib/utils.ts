import { getUploadUrl } from '@/app/products/add/actions';

interface ChageImageProps {
  e: React.ChangeEvent<HTMLInputElement>;
  setPreview: (url: string) => void;
  setFile: (file: File) => void;
  setUploadUrl: (url: string) => void;
  setValue: (name: 'photo' | 'title' | 'price' | 'description', value: string) => void;
}

const IMAGE_FILE_SIZE = 1024 * 1024 * 5;

export function formatToWon(price: number): string {
  return price.toLocaleString('ko-KR');
}

export function formatToTimeAgo(date: string): string {
  const dayInMs = 1000 * 60 * 60 * 24;
  const time = new Date(date).getTime();
  const now = new Date().getTime();
  const diff = Math.round((time - now) / dayInMs);

  const formatter = new Intl.RelativeTimeFormat('ko');

  return formatter.format(diff, 'days');
}

export const onChangeImage = async ({ e, setPreview, setFile, setUploadUrl, setValue }: ChageImageProps) => {
  const {
    target: { files },
  } = e;

  if (!files) return;

  const file = files[0];

  if (file.type.split('/')[0] !== 'image') {
    alert('이미지 파일만 업로드 가능합니다.');
    return;
  }

  if (file.size > IMAGE_FILE_SIZE) {
    alert('파일은 5MB 이하여야 합니다.');
    return;
  }

  const url = URL.createObjectURL(file);
  setPreview(url);
  setFile(file);

  const { success, result } = await getUploadUrl();

  if (success) {
    const { id, uploadURL } = result;
    setUploadUrl(uploadURL);
    setValue('photo', `${process.env.NEXT_PUBLIC_CLOUDFLARE_IMAGE_URL}/${id}`);
  }
};
