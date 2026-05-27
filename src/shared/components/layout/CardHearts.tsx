import "./CardHearts.css";
import { createPortal } from "react-dom";

type CardHeartsProps = {
  showFront?: boolean;
  fullPage?: boolean;
};

export default function CardHearts({ showFront = false, fullPage = false }: CardHeartsProps) {
  if (fullPage) {
    const pageHearts = (
      <div className="card-hearts-page" aria-hidden="true">
        <span className="main-page-card-heart page-heart-1 main-page-card-heart-yellow" />
        <span className="main-page-card-heart page-heart-2 main-page-card-heart-blue main-page-card-heart-lines" />
        <span className="main-page-card-heart page-heart-3 main-page-card-heart-green main-page-card-heart-dots" />
        <span className="main-page-card-heart page-heart-4 main-page-card-heart-purple" />
        <span className="main-page-card-heart page-heart-5 main-page-card-heart-coral main-page-card-heart-dots" />
        <span className="main-page-card-heart page-heart-6 main-page-card-heart-orange" />
        <span className="main-page-card-heart page-heart-7 main-page-card-heart-pink main-page-card-heart-lines" />
        <span className="main-page-card-heart page-heart-8 main-page-card-heart-mint" />
        <span className="main-page-card-heart page-heart-9 main-page-card-heart-red main-page-card-heart-dots" />
        <span className="main-page-card-heart page-heart-10 main-page-card-heart-blue" />
      </div>
    );

    if (typeof document === "undefined") {
      return null;
    }

    return createPortal(pageHearts, document.body);
  }

  return (
    <>
      <div className="card-hearts-back" aria-hidden="true">
        <span className="main-page-card-heart main-page-card-heart-top-center main-page-card-heart-red main-page-card-heart-dots" />
        <span className="main-page-card-heart main-page-card-heart-top-right main-page-card-heart-blue main-page-card-heart-lines" />
        <span className="main-page-card-heart main-page-card-heart-bottom-right main-page-card-heart-orange" />
      </div>
      {showFront && (
        <div className="card-hearts-front" aria-hidden="true">
          <span className="main-page-card-heart main-page-card-heart-top-left main-page-card-heart-yellow" />
          <span className="main-page-card-heart main-page-card-heart-left-center main-page-card-heart-green main-page-card-heart-dots" />
          <span className="main-page-card-heart main-page-card-heart-bottom-center main-page-card-heart-pink" />
        </div>
      )}
    </>
  );
}
