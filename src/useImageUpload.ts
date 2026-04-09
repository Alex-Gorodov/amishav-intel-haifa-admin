import { useState } from 'react';

// export const useImageUpload = (
//   onImageUploaded: (url: string) => void
// ) => {
//   const [uploading, setUploading] = useState(false);

//   const uploadToCloudinary = useCallback(async (file: File) => {
//     try {
//       setUploading(true);

//       const formData = new FormData();
//       formData.append('file', file);
//       formData.append('upload_preset', 'ml_default');

//       const res = await fetch(
//         'https://api.cloudinary.com/v1_1/didctp0hu/image/upload',
//         {
//           method: 'POST',
//           body: formData,
//         }
//       );

//       const data = await res.json();

//       if (!data.secure_url) {
//         console.error('❌ Cloudinary error:', data);
//         return;
//       }

//       onImageUploaded(data.secure_url);
//     } catch (e: any) {
//       console.error('❌ Upload error:', e.message || e);
//     } finally {
//       setUploading(false);
//     }
//   }, [onImageUploaded]);

// //   const handlePickImage = useCallback(
// //     async (e: React.ChangeEvent<HTMLInputElement>) => {
// //       const file = e.target.files?.[0];
// //       if (!file) return;

// //       await uploadToCloudinary(file);
// //     },
// //     [uploadToCloudinary]
// //   );

// const handlePickImage = useCallback(
//   async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = Array.from(e.target.files || []);

//     for (const file of files) {
//       await uploadToCloudinary(file);
//     }

//   },
//   [uploadToCloudinary]
// );

//   return { handlePickImage, uploading };
// };

export const useImageUpload = (
  onImageUploaded: (url: string) => void
) => {
  const [uploading, setUploading] = useState(false);

  const uploadToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'ml_default');

    const res = await fetch(
      'https://api.cloudinary.com/v1_1/didctp0hu/image/upload',
      {
        method: 'POST',
        body: formData,
      }
    );

    const data = await res.json();

    if (!data.secure_url) {
      console.error('❌ Cloudinary error:', data);
      return;
    }

    return data.secure_url;
  };

  const handlePickImage = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setUploading(true);

      for (const file of Array.from(files)) {
        const url = await uploadToCloudinary(file);
        if (url) {
          console.log('UPLOADED:', url);
          onImageUploaded(url);
        }
      }
    } catch (e) {
      console.error('❌ Upload error:', e);
    } finally {
      setUploading(false);
    }
  };

  return { handlePickImage, uploading };
};