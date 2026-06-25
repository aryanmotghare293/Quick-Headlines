import { Radio } from "lucide-react";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <Radio size={19} />
          <strong>Quick Headlines</strong>
        </div>
        <p>
          Headlines and summaries belong to their respective publishers. Follow
          “Read more” to support the original reporting.
        </p>
        <span>&copy; {new Date().getFullYear()} Quick Headlines</span>
      </div>
    </footer>
  );
}
