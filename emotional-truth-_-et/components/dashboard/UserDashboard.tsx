// Created the UserDashboard component.
import React from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import { useTranslator } from '../../hooks/useTranslator';
import { getYouTubeEmbedUrl } from '../../utils/url';
import { VideoOffIcon } from '../icons/VideoOffIcon';

export const UserDashboard: React.FC = () => {
  const { currentUser } = useAppContext();
  const t = useTranslator();
  
  if (!currentUser || currentUser.role !== 'user') return null;

  const videoUrl = currentUser.videoUrl ? getYouTubeEmbedUrl(currentUser.videoUrl) : '';

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">{t('userDashboardTitle')}</h2>
      <div>
        <h3 className="text-xl font-semibold mb-2 text-gray-700">{t('yourVideo')}</h3>
        {videoUrl ? (
          <div className="relative" style={{ paddingBottom: '56.25%' /* 16:9 Aspect Ratio */ }}>
            <iframe
              src={videoUrl}
              title="User Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full rounded-md"
            ></iframe>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg border-gray-300">
            <VideoOffIcon className="w-16 h-16 text-gray-400 mb-4" />
            <p className="text-gray-500">{t('noVideoUrl')}</p>
          </div>
        )}
      </div>
    </div>
  );
};