import { BookContentInfo, PageInfo } from '@/types/book';

const sortContent = (content: BookContentInfo): BookContentInfo => {
    // 페이지별로 정렬
    const sortedPages = content.pages
      .sort((a, b) => a.pageNumber - b.pageNumber) // pageNumber 기준으로 오름차순 정렬
      .reduce((acc: PageInfo[], currentPage: PageInfo) => {
        // 동일한 pageNumber가 있을 경우 pageId가 작은 것만 남긴다
        const existingPageIndex = acc.findIndex(
            (page) => page.pageNumber === currentPage.pageNumber,
        );
        if (existingPageIndex === -1) {
          // 새로운 pageNumber가 나오면 추가
          acc.push(currentPage);
        } else {
          // 기존 pageNumber가 있으면 pageId가 작은 것만 남기고 큰 것은 삭제
          const existingPage = acc[existingPageIndex];
          if (existingPage.pageId > currentPage.pageId) {
            acc[existingPageIndex] = currentPage;
          }
        }
        return acc;
      }, []);

    // 각 페이지의 audios를 order 기준으로 정렬
    sortedPages.forEach((page) => {
      page.audios.sort((a, b) => a.order - b.order);
    });

    return {
      ...content,
      pages: sortedPages,
    };
  };

  export default sortContent;
