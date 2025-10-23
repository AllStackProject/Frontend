import React, { useState } from "react";

interface QuizVideo {
  id: string;
  title: string;
  category: string;
  solvedCount: number;
  uploadDate: string;
}

const dummyQuizzes: QuizVideo[] = [
  { id: "Q001", title: "AI 서비스 개요", category: "AI", solvedCount: 24, uploadDate: "2025-02-01" },
  { id: "Q002", title: "보안 인식 교육", category: "보안", solvedCount: 15, uploadDate: "2025-02-10" },
];

const QuizManagementSection: React.FC = () => {
  const [query, setQuery] = useState("");

  const filtered = dummyQuizzes.filter((v) =>
    v.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="영상 제목으로 검색"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-64 focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={() => setQuery("")}
          className="text-sm px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
        >
          초기화
        </button>
      </div>

      <table className="w-full border text-sm">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="p-3 text-left">번호</th>
            <th className="p-3 text-left">영상 제목</th>
            <th className="p-3 text-left">카테고리</th>
            <th className="p-3 text-left">응시자 수</th>
            <th className="p-3 text-left">등록일</th>
            <th className="p-3 text-center">상세 보기</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((quiz) => (
            <tr key={quiz.id} className="border-b hover:bg-gray-50">
              <td className="p-3">{quiz.id}</td>
              <td className="p-3">{quiz.title}</td>
              <td className="p-3">{quiz.category}</td>
              <td className="p-3">{quiz.solvedCount}</td>
              <td className="p-3">{quiz.uploadDate}</td>
              <td className="p-3 text-center">
                <button className="text-blue-500 hover:text-blue-700 text-sm">
                  상세 보기
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QuizManagementSection;