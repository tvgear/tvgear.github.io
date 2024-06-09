import { BlockLoading } from "./style";
import Logo from "@/components/Logo";

interface LoadingProps {
  showLoading?: boolean;
}

const Loading: React.FC<LoadingProps> = ({ showLoading }) => {
  return (
    <BlockLoading className={`${showLoading ? "active" : ""}`}>
      <Logo scale="4" moveAni />
    </BlockLoading>
  );
};

export default Loading;
