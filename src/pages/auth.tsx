import Head from 'next/head';
import { ClipboardEvent, FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
import { LockKeyhole } from "lucide-react";
import { createAdminSession, getAdminAccessCode, hasAdminSession } from "@/utils/admin-auth";

const AuthPage = styled.main`
  min-height: 100dvh;
  display: grid;
  place-items: center;
  padding: 24px;
  background: #f4f5f7;
  color: #17191c;
`;

const AuthCard = styled.section`
  width: min(100%, 420px);
  padding: 42px;
  background: #fff;
  border: 1px solid #e6e8eb;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(25, 31, 40, 0.1);

  @media (max-width: 480px) {
    padding: 32px 24px;
  }
`;

const IconWrap = styled.div`
  width: 48px;
  height: 48px;
  display: grid;
  place-items: center;
  margin-bottom: 24px;
  border-radius: 14px;
  background: #17191c;
  color: #fff;
`;

const Title = styled.h1`
  font-family: F_BOLD;
  font-size: 2.6rem;
  line-height: 1.2;
  letter-spacing: -0.04em;
`;

const Description = styled.p`
  margin-top: 10px;
  color: #6b7280;
  font-size: 1.4rem;
  line-height: 1.6;
`;

const Form = styled.form`
  margin-top: 30px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 9px;
  font-family: F_SEMIBOLD;
  font-size: 1.3rem;
  text-align: center;
`;

const CodeInputs = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
`;

const CodeInput = styled.input`
  width: 54px;
  height: 52px;
  padding: 0;
  border: 1px solid #d9dde3;
  border-radius: 10px;
  outline: none;
  color: #17191c;
  font-family: F_BOLD;
  font-size: 2rem;
  text-align: center;
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus {
    border-color: #17191c;
    box-shadow: 0 0 0 4px rgba(23, 25, 28, 0.1);
  }

  @media (max-width: 380px) {
    width: 48px;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  height: 52px;
  margin-top: 16px;
  border: 0;
  border-radius: 10px;
  background: #17191c;
  color: #fff;
  cursor: pointer;
  font-family: F_BOLD;
  font-size: 1.4rem;
  transition: background 0.2s, transform 0.2s;

  &:hover {
    background: #30343a;
  }

  &:active {
    transform: translateY(1px);
  }
`;

const ErrorMessage = styled.p`
  margin-top: 12px;
  color: #d63031;
  font-size: 1.25rem;
`;

const Auth = () => {
  const router = useRouter();
  const [accessCode, setAccessCode] = useState<string[]>(["", "", "", ""]);
  const [error, setError] = useState("");
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (hasAdminSession()) {
      void router.replace("/admin");
    }
  }, [router]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (accessCode.join("") !== getAdminAccessCode()) {
      setError("Mã đăng nhập không chính xác. Vui lòng thử lại.");
      return;
    }

    createAdminSession();
    void router.replace("/admin");
  };

  const updateDigit = (index: number, digit: string) => {
    setAccessCode((previousCode) => previousCode.map((value, valueIndex) => (valueIndex === index ? digit : value)));
    if (error) setError("");

    if (digit && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (event.key !== "Backspace") return;

    event.preventDefault();
    if (accessCode[index]) {
      updateDigit(index, "");
      return;
    }

    if (index > 0) {
      updateDigit(index - 1, "");
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>, startIndex: number) => {
    const pastedCode = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4 - startIndex);
    if (!pastedCode) return;

    event.preventDefault();
    setAccessCode((previousCode) => previousCode.map((value, index) => {
      const pastedIndex = index - startIndex;
      return pastedIndex >= 0 && pastedIndex < pastedCode.length ? pastedCode[pastedIndex] ?? value : value;
    }));
    if (error) setError("");
    inputRefs.current[Math.min(startIndex + pastedCode.length, 3)]?.focus();
  };

  return (
    <AuthPage>
      <Head>
        <title>Đăng nhập quản trị | TVGEAR</title>
      </Head>
      <AuthCard>
        <IconWrap><LockKeyhole size={23} /></IconWrap>
        <Title>Đăng nhập quản trị</Title>
        <Description>Nhập mã đăng nhập để truy cập khu vực quản trị TVGEAR.</Description>
        <Form onSubmit={handleSubmit}>
          <Label htmlFor="admin-access-code-0">Mã đăng nhập</Label>
          <CodeInputs>
            {accessCode.map((digit, index) => (
              <CodeInput
                key={index}
                id={`admin-access-code-${index}`}
                ref={(element) => { inputRefs.current[index] = element; }}
                type="text"
                inputMode="numeric"
                autoComplete={index === 0 ? "one-time-code" : "off"}
                aria-label={`Chữ số ${index + 1} của mã đăng nhập`}
                value={digit}
                onChange={(event) => updateDigit(index, event.target.value.replace(/\D/g, "").slice(-1))}
                onKeyDown={(event) => handleKeyDown(event, index)}
                onPaste={(event) => handlePaste(event, index)}
                onFocus={(event) => event.currentTarget.select()}
                autoFocus={index === 0}
                maxLength={1}
                required
              />
            ))}
          </CodeInputs>
          <SubmitButton type="submit">Đăng nhập</SubmitButton>
          {error && <ErrorMessage role="alert">{error}</ErrorMessage>}
        </Form>
      </AuthCard>
    </AuthPage>
  );
};

export default Auth;
