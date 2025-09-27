import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import {VitePWA} from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate', // 서비스 워커 업데이트 방식을 자동으로 처리
            devOptions: {
                enabled: true, // 개발 환경에서도 PWA를 테스트할 수 있도록 활성화
            },
            manifest: {
                name: 'Ringling', // 앱 이름
                short_name: 'Ringling',
                description: '출근길에 저장 콘텐츠를 푸시 알림해봐요!', // 앱 설명
                icons: [
                    {
                        src: '/icons/icon-16.png',
                        sizes: '16x16',
                        type: 'image/png'
                    },
                    {
                        src: '/icons/icon-32.png',
                        sizes: '32x32',
                        type: 'image/png'
                    },
                    {
                        src: '/icons/icon-192.png',
                        sizes: '192x192',
                        type: 'image/png',
                        purpose: 'any maskable'
                    },
                    {
                        src: '/icons/icon-512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'any maskable'
                    }
                ]
            },
        })
    ],
})
