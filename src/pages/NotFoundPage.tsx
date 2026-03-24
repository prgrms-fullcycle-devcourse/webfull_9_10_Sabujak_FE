import { ErrorPage } from '../shared/components/ErrorPage';

const NotFoundPage = () => {
  return (
    <ErrorPage secondaryButton={{
      label: "이전 페이지로 돌아가기",
      onClick: () => window.history.back()
    }}></ErrorPage>
  );
};

export default NotFoundPage;