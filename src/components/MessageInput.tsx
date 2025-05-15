
import { ChangeEvent } from 'react';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface MessageInputProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  label: string;
  placeholder?: string;
  readOnly?: boolean;
  className?: string;
  labelClassName?: string;
  rows?: number;
}

const MessageInput = ({
  value,
  onChange,
  label,
  placeholder,
  readOnly = false,
  className = "",
  labelClassName = "",
  rows = 4
}: MessageInputProps) => {
  return (
    <div className="space-y-2">
      <Label className={labelClassName}>{label}</Label>
      <Textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={readOnly}
        className={`${readOnly ? 'bg-muted cursor-default' : ''} ${className}`}
        rows={rows}
      />
    </div>
  );
};

export default MessageInput;
