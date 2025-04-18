'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function TestLogin() {
  const [testResults, setTestResults] = useState([]);
  const [isTesting, setIsTesting] = useState(false);
  const router = useRouter();

  const addTestResult = (test, result, details = '') => {
    setTestResults(prev => [...prev, {
      test,
      result,
      details,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const runTests = async () => {
    setIsTesting(true);
    setTestResults([]);

    // Test 1: Login normal
    try {
      const result = await signIn('credentials', {
        email: 'admin@example.com',
        password: 'admin123',
        redirect: false,
      });

      if (result?.error) {
        addTestResult('Login normal', '❌ Fallido', result.error);
      } else {
        addTestResult('Login normal', '✅ Exitoso');
      }
    } catch (error) {
      addTestResult('Login normal', '❌ Error', error.message);
    }

    // Test 2: Intentos fallidos
    try {
      for (let i = 0; i < 5; i++) {
        const result = await signIn('credentials', {
          email: 'admin@example.com',
          password: 'wrongpassword',
          redirect: false,
        });

        if (i < 4) {
          if (result?.error) {
            addTestResult(`Intento fallido ${i + 1}`, '✅ Esperado', 'Error de credenciales');
          } else {
            addTestResult(`Intento fallido ${i + 1}`, '❌ Inesperado', 'Login exitoso con credenciales incorrectas');
          }
        } else {
          if (result?.error?.includes('bloqueada')) {
            addTestResult('Bloqueo por intentos', '✅ Exitoso', 'Cuenta bloqueada correctamente');
          } else {
            addTestResult('Bloqueo por intentos', '❌ Fallido', 'No se activó el bloqueo');
          }
        }
      }
    } catch (error) {
      addTestResult('Prueba de intentos', '❌ Error', error.message);
    }

    // Test 3: CAPTCHA
    try {
      const result = await signIn('credentials', {
        email: 'admin@example.com',
        password: 'wrongpassword',
        redirect: false,
      });

      if (result?.error?.includes('CAPTCHA')) {
        addTestResult('Activación CAPTCHA', '✅ Exitoso', 'CAPTCHA requerido');
      } else {
        addTestResult('Activación CAPTCHA', '❌ Fallido', 'CAPTCHA no activado');
      }
    } catch (error) {
      addTestResult('Prueba CAPTCHA', '❌ Error', error.message);
    }

    setIsTesting(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Pruebas de Seguridad del Login</h2>
          
          <button
            onClick={runTests}
            disabled={isTesting}
            className="mb-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:bg-gray-400"
          >
            {isTesting ? 'Ejecutando pruebas...' : 'Ejecutar pruebas'}
          </button>

          <div className="space-y-4">
            {testResults.map((test, index) => (
              <div
                key={index}
                className={`p-4 rounded ${
                  test.result.includes('✅') ? 'bg-green-50' : 'bg-red-50'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{test.test}</span>
                  <span className="font-bold">{test.result}</span>
                </div>
                {test.details && (
                  <p className="mt-2 text-sm text-gray-600">{test.details}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">{test.timestamp}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 