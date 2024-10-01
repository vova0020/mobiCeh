// components/withAuth.tsx
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const withAuth = (WrappedComponent: React.ComponentType) => {
  const WithAuth = (props: React.ComponentProps<typeof WrappedComponent>) => {
    const router = useRouter();

    useEffect(() => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/pages/auth'); // Перенаправить на страницу авторизации, если токена нет
      }
    }, [router]);

    return <WrappedComponent {...props} />;
  };

  // Устанавливаем displayName для лучшей отладки
  WithAuth.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return WithAuth;
};

export default withAuth;
