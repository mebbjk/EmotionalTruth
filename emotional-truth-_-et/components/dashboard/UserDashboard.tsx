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

  const embedUrls = currentUser.videoUrls?.map(getYouTubeEmbedUrl).filter(url => url) || [];

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">{t('userDashboardTitle')}</h2>
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-gray-700">
          {t('welcomeUser').replace('{{username}}', `${currentUser.firstName} ${currentUser.lastName}`)}
        </h3>
        <p className="text-gray-500">{currentUser.email}</p>
      </div>

      <div className="mt-6 border-t pt-6">
        <h3 className="text-lg font-semibold mb-2">{t('yourVideo')}</h3>
        {embedUrls.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {embedUrls.map((url, index) => (
              <div key={index} className="aspect-video">
                <iframe
                  width="100%"
                  height="100%"
                  src={url}
                  title={`YouTube video player ${index + 1}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="rounded-lg"
                ></iframe>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg border border-dashed">
            <VideoOffIcon className="w-12 h-12 text-gray-400 mb-2" />
            <p className="text-gray-500">{t('noVideoUrl')}</p>
          </div>
        )}
      </div>
    </div>
  );
};