import { useNavigate } from 'react-router-dom';
import { ErrorPage } from '../shared/components/feedback/ErrorPage';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <ErrorPage secondaryButton={{
      label: "이전 페이지로 돌아가기",
      onClick: () => window.history.length >= 2 ? void navigate(-1) : void navigate('/')
    }}/>
  );
};

export default NotFoundPage;