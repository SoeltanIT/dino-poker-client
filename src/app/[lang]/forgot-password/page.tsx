import ForgotPasswordPage from "@/components/organisms/ForgotPassword";
import { getDictionary, getLocale } from "@/dictionaries/dictionaries";

// export const runtime = 'edge'

export default async function Page({ params, ...props }: any) {
  const dict = await getDictionary(params?.lang);
  const locale = await getLocale();

  return <ForgotPasswordPage lang={dict} locale={locale} />;
}
