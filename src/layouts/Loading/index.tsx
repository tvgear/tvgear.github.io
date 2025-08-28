import { BlockLoading } from "./style";
import Logo from "@/components/Logo";

interface LoadingProps {
  showLoading?: boolean;
}

const Loading: React.FC<LoadingProps> = ({ showLoading }) => {
  return (
    <BlockLoading className={`${showLoading ? "active" : ""}`}>
      <Logo size={150} isText />
    </BlockLoading>
  );
};

export default Loading;
