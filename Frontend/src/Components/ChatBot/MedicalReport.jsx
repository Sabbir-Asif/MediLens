import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../Authentication/AuthProvider';
import { format } from 'date-fns';

const MedicalReport2 = (props) => {
  const { user } = useContext(AuthContext);
  const [isReportSaved, setIsReportSaved] = useState(false);

  // Extract JSON from the props
  const rawReport = props.report;
  const jsonMatch = rawReport.match(/```json\s*(.*?)\s*```/s) || rawReport.match(/json\s*(.*)/s);
  const report = jsonMatch ? JSON.parse(jsonMatch[1]) : {};

  useEffect(() => {
    const saveReport = async () => {
      // Only proceed if we have a user ID, the report hasn't been saved yet, and we have report data
      if (!user?.id || isReportSaved || !report) {
        return;
      }

      try {
        const chatData = {
          userId: user.id,
          title: report.স্বাস্থ্য_পরীক্ষা?.শিরোনাম || "Medical Report",
          messages: [
            {
              role: "system",
              content: rawReport,
              timestamp: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSSSS")
            }
          ]
        };

        const response = await fetch('http://localhost:8000/api/chats/', {
          method: 'POST',
          headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(chatData)
        });

        if (response.ok) {
          setIsReportSaved(true);
          console.log('Report saved successfully');
        } else {
          console.error('Failed to save report');
        }
      } catch (error) {
        console.error('Error saving report:', error);
      }
    };

    saveReport();
  }, [user?.id, rawReport, report]); // Removed isReportSaved from dependencies

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Rest of the JSX remains the same */}
      {/* রোগীর তথ্য */}
      <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-orange-800 mb-4">
            {report.রোগীর_তথ্য?.শিরোনাম}
          </h2>
          <p className="text-gray-800 text-lg leading-relaxed">
            {report.রোগীর_তথ্য?.বিবরণ}
          </p>
        </div>
      </div>

      {/* স্বাস্থ্য পরীক্ষা */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {report.স্বাস্থ্য_পরীক্ষা?.শিরোনাম}
          </h2>
          <div className="space-y-6">
            {report.স্বাস্থ্য_পরীক্ষা?.বিভাগসমূহ?.map((section, index) => (
              <div key={index} className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-700">
                  {section.শিরোনাম}
                </h3>
                <p className="text-gray-600 whitespace-pre-line">
                  {section.বিবরণ}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* চিকিৎসা পরিভাষা */}
      <div className="bg-blue-50 rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-blue-800 mb-6">
            চিকিৎসা পরিভাষা
          </h2>
          <div className="grid gap-4">
            {report.চিকিৎসা_পরিভাষা?.map((term, index) => (
              <div key={index} className="border-b border-blue-100 pb-4 last:border-b-0">
                <div className="flex flex-col gap-2">
                  <h4 className="font-semibold text-blue-700">
                    {term.পরিভাষা}
                  </h4>
                  <p className="text-gray-600">
                    {term.ব্যাখ্যা}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* গুরুত্বপূর্ণ তথ্য */}
      <div className="bg-green-50 rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-green-800 mb-6">
            গুরুত্বপূর্ণ তথ্য
          </h2>
          {report.গুরুত্বপূর্ণ_তথ্য?.map((item, index) => (
            <div key={index} className="space-y-3 border-b border-green-100 pb-4 last:border-b-0">
              <p className="text-gray-800 font-medium">
                {item.তথ্য}
              </p>
              {item.পরামর্শ && (
                <div className="bg-green-100 p-3 rounded-md">
                  <p className="text-green-800">
                    <span className="font-medium">পরামর্শ: </span>
                    {item.পরামর্শ}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MedicalReport2;