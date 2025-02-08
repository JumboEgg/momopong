  import React, { useState, useRef, useEffect } from 'react';

  interface FrameDto {
    frameTitle: string;
    frameFileName: string;
    frameUrl: string;
    createdAt: string;
  }

  function App() {
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [savedImages, setSavedImages] = useState<FrameDto[]>([]);
    const [imageUrls, setImageUrls] = useState<{ [key: string]: string }>({});
    const child_id = 1;

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        setSelectedImage(file);
      }
    };

    // 개별 이미지 로드
    const loadImage = async (frame: FrameDto) => {
        try {
          const response = await fetch(frame.frameUrl, {
            headers: {
              Accept: 'image/webp,image/*;q=0.8,*/*;q=0.5',
            },
          });

          if (!response.ok) {
            throw new Error('Failed to load image');
          }

          const blob = await response.blob();
          const imageUrl = URL.createObjectURL(blob);

          setImageUrls((prev) => ({
            ...prev,
            [frame.frameFileName]: imageUrl,
          }));
        } catch (error) {
          console.error(`Error loading image for ${frame.frameTitle}:`, error);
        }
      };

    // 이미지 목록 가져오기
    const fetchSavedImages = async () => {
      try {
        const response = await fetch(`http://localhost:8081/api/profile/${child_id}/frame`);
        if (!response.ok) {
          throw new Error('Failed to fetch frames');
        }
        const data = await response.json();
        setSavedImages(data);

        // 각 이미지 로드
        data.forEach(async (frame: FrameDto) => {
          await loadImage(frame);
        });
      } catch (error) {
        console.error('Error fetching frames:', error);
      }
    };

    // fileUrl이랑 frameTitle을 받아서 저장하는 요청
  const saveFrameInfo = async (fileUrl: string, fileName: string) => {
    try {
      const requestBody = {
        frameTitle: '신데렐라구두', // 실제로는 동적으로 받아올 값
        frameFileName: fileName,
      };

      const response = await fetch(
        `http://localhost:8081/api/draw/${child_id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log('Frame info saved successfully');
    } catch (error) {
      console.error('Error saving frame info:', error);
    }
  };

    const MAX_WIDTH = 1024;
    const MAX_HEIGHT = 1024;

    // webp로 이미지 파일 변환
    async function processFile(file: File): Promise<Blob> {
      return new Promise((resolve, reject) => {
        const rawImage = new Image();
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('2d context not supported'));
          return;
        }

        rawImage.onload = () => {
          let { width } = rawImage;
          let { height } = rawImage;

          // 비율 계산
          if (width > height) {
            if (width > MAX_WIDTH) {
              height = Math.round(height * (MAX_WIDTH / width));
              width = MAX_WIDTH;
            }
          } else if (height > MAX_HEIGHT) {
              width = Math.round(width * (MAX_HEIGHT / height));
              height = MAX_HEIGHT;
            }

          canvas.width = width;
          canvas.height = height;

          ctx.drawImage(rawImage, 0, 0, width, height);

          // 품질 옵션 추가 (0.8 = 80% 품질)
          canvas.toBlob(
            (blob) => {
              if (blob) {
                // URL.revokeObjectURL로 메모리 해제
                URL.revokeObjectURL(rawImage.src);
                resolve(blob);
              } else {
                reject(new Error('WebP 변환 실패'));
              }
            },
            'image/webp',
            0.8,
          );
        };

        rawImage.onerror = () => {
          // error 파라미터 제거
          URL.revokeObjectURL(rawImage.src);
          reject(new Error('이미지 로드 실패'));
        };

        rawImage.src = URL.createObjectURL(file);
      });
    }

    // 이미지 업로드
    const uploadImage = async () => {
      if (!selectedImage) return;

      try {
        // 1. presigned URL 받아오기
        const presignedResponse = await fetch(
          'http://localhost:8081/api/draw/presigned-url',
          {
            method: 'GET',
          },
        );

        if (!presignedResponse.ok) {
          throw new Error(`HTTP error! status: ${presignedResponse.status}`);
        }

        const data = await presignedResponse.json();
        console.log(data);

        const { presignedUrl } = data;
        const { fileName } = data;
        console.log('presignedUrl', presignedUrl);
        console.log('fileName', fileName);

        console.log(selectedImage, selectedImage.type);

        // 2. presigned URL로 이미지 업로드
        const webpImage = await processFile(selectedImage);
        await fetch(presignedUrl, {
          method: 'PUT',
          body: webpImage,
          headers: {
            'Content-Type': 'image/webp',
          },
        });

        // 3. 업로드 성공 후 처리
        console.log('이미지 업로드 완료:', fileName);

        // fileUrl을 서버에 저장하거나 다른 처리를 할 수 있습니다
        await saveFrameInfo(data.fileUrl, fileName);

        // 4. 이미지 선택 상태 초기화
        setSelectedImage(null);
      } catch (error) {
        console.error('이미지 업로드 실패:', error);
      }
    };

    // 컴포넌트 마운트 시 이미지 목록 불러오기
    useEffect(() => {
      fetchSavedImages();
    }, []);

    // URL 정리를 위한 cleanup useEffect
    useEffect(() => () => {
        Object.values(imageUrls).forEach((url) => {
          URL.revokeObjectURL(url);
        });
      }, [imageUrls]);

    const handleUploadClick = () => {
      fileInputRef.current?.click();
    };

    return (
      <div className="p-4 max-w-lg mx-auto">
        {/* 업로드 섹션 */}
        <div className="mb-4">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageUpload}
          />

          {selectedImage && (
            <div className="mt-4">
              <img
                src={URL.createObjectURL(selectedImage)}
                alt="Selected"
                className="w-full max-h-48 object-cover rounded"
              />
              <button
                type="button"
                onClick={() => uploadImage()}
                className="mt-2 mr-2 p-2 rounded bg-blue-500 text-white hover:bg-blue-600"
              >
                업로드
              </button>
              <button
                type="button"
                onClick={() => setSelectedImage(null)}
                className="mt-2 p-2 rounded bg-red-500 text-white hover:bg-red-600"
              >
                취소
              </button>
            </div>
          )}
        </div>

        {/* 이미지 불러오기 버튼 추가 */}
        <button
          type="button"
          onClick={fetchSavedImages}
          className="mb-4 p-2 rounded bg-green-500 text-white hover:bg-green-600"
        >
          저장된 이미지 불러오기
        </button>

        {/* 이미지 목록 */}
        <div className="grid grid-cols-1 gap-4 mt-4">
          {savedImages.map((frame) => (
            <div key={frame.frameFileName} className="border rounded-lg p-4">
              {imageUrls[frame.frameFileName] ? (
                <img
                  src={imageUrls[frame.frameFileName]}
                  alt={frame.frameTitle}
                  className="w-full h-48 object-cover rounded"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 rounded flex items-center justify-center">
                  Loading...
                </div>
              )}
              <p className="text-sm text-gray-500 mt-2">
                Created:
                {' '}
                {new Date(frame.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  export default App;
