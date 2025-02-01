import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../Authentication/AuthProvider';
import { format } from 'date-fns';
import { AlertCircle, Heart, Stethoscope, FileText, Info } from 'lucide-react';

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
    <div className="container mx-auto p-4 md:p-6 space-y-6 font-poppins bg-gradient-to-br from-[#F8FDFF] via-white to-[#E8F7FA]">
      {/* Patient Information */}
      <div className="bg-white rounded-xl shadow-sm ring-1 ring-[#4DA1A9]/10 overflow-hidden">
        <div className="bg-gradient-to-r from-[#4DA1A9] to-[#79D7BE] p-4">
          <div className="flex items-center gap-3">
            <Heart className="h-6 w-6 text-white" />
            <h2 className="text-xl font-bold text-white font-exo">
              {report.রোগীর_তথ্য?.শিরোনাম || "রোগীর তথ্য"}
            </h2>
          </div>
        </div>
        <div className="p-5">
          <p className="text-gray-700 leading-relaxed">
            {report.রোগীর_তথ্য?.বিবরণ}
          </p>
        </div>
      </div>

      {/* Health Examination */}
      <div className="bg-white rounded-xl shadow-sm ring-1 ring-[#4DA1A9]/10 overflow-hidden">
        <div className="p-5">
          <div className="flex items-center gap-3 mb-6">
            <Stethoscope className="h-6 w-6 text-[#4DA1A9]" />
            <h2 className="text-xl font-bold text-gray-800 font-exo">
              {report.স্বাস্থ্য_পরীক্ষা?.শিরোনাম}
            </h2>
          </div>
          <div className="space-y-6">
            {report.স্বাস্থ্য_পরীক্ষা?.বিভাগসমূহ?.map((section, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <h3 className="text-base font-semibold text-[#4DA1A9] mb-2">
                  {section.শিরোনাম}
                </h3>
                <p className="text-gray-600 text-sm whitespace-pre-line">
                  {section.বিবরণ}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Medical Terms */}
      <div className="bg-white rounded-xl shadow-sm ring-1 ring-[#4DA1A9]/10 overflow-scroll">
        <div className="p-5">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="h-6 w-6 text-[#4DA1A9]" />
            <h2 className="text-xl font-bold text-gray-800 font-exo">
              চিকিৎসা পরিভাষা
            </h2>
          </div>
          <div className="grid gap-4">
            {report.চিকিৎসা_পরিভাষা?.map((term, index) => (
              <div key={index} className="p-4 bg-[#4DA1A9]/5 rounded-lg">
                <div className="space-y-2">
                  <h4 className="font-medium text-[#4DA1A9]">
                    {term.পরিভাষা}
                  </h4>
                  <p className="text-gray-600 text-sm">
                    {term.ব্যাখ্যা}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Important Information */}
      <div className="bg-white rounded-xl shadow-sm ring-1 ring-[#4DA1A9]/10 overflow-scroll">
        <div className="p-5">
          <div className="flex items-center gap-3 mb-6">
            <AlertCircle className="h-6 w-6 text-[#4DA1A9]" />
            <h2 className="text-xl font-bold text-gray-800 font-exo">
              গুরুত্বপূর্ণ তথ্য
            </h2>
          </div>
          {report.গুরুত্বপূর্ণ_তথ্য?.map((item, index) => (
            <div key={index} className="mb-4 last:mb-0">
              <div className="p-4 bg-[#4DA1A9]/5 rounded-lg">
                <p className="text-gray-700 text-sm mb-3">
                  {item.তথ্য}
                </p>
                {item.পরামর্শ && (
                  <div className="flex items-start gap-2 p-3 bg-[#79D7BE]/10 rounded-md">
                    <Info className="h-4 w-4 text-[#4DA1A9] mt-0.5" />
                    <p className="text-sm text-gray-600">
                      <span className="font-medium text-[#4DA1A9]">পরামর্শ: </span>
                      {item.পরামর্শ}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MedicalReport2;