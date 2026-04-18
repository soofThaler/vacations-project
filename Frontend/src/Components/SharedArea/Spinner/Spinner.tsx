import "./Spinner.css";
import imageSource from "../../../assets/loading.gif";

interface SpinnerProps {
    size?: "small" | "medium" | "large";
}

export function Spinner({ size = "large" }: SpinnerProps) {
    return (
        <div className={`Spinner ${size}`}>
            <img src={imageSource} />
        </div>
    );
}
