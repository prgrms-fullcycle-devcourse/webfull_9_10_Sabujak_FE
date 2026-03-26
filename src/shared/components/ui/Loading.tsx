import PageLayout from "../layout/PageLayout";

interface LoadingProps {
  image : string;
  text? : string;
  
}

const Loading = ({
  image,
  text = '아무것도 없어요',
} : LoadingProps) => {
  return (
    <PageLayout>
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <img src={image} alt="loading" className="w-48 h-48 object-contain" />
      <p className="mt-21 text-xl text-center font-bold">{text}</p>
    </div>
    </PageLayout>
  );
};
export default Loading;