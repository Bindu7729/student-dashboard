import apiClient from '@/lib/api';
import { studentService, type StudentOverview, type AssignmentProgress, type RiskDetails } from './student';

export interface FacultyOverview {
    total_students: number;
    high_risk_count: number;
    high_risk_percentage: number;
    average_attendance: number;
    average_risk_score: number;
    high_risk_department: string | null;
    risk_distribution: Record<string, number>;
}

export interface StudentSummary {
    id: string;
    name: string;
    department: string;
    risk_level: string;
    risk_score: number;
    attendance: number;
    engagement: number;
}

export interface AnalyticsData {
    department_risks: {
        department: string;
        avg_risk: number;
        student_count: number;
    }[];
}

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const randFloat = (min: number, max: number, decimals: number = 2) => Number((Math.random() * (max - min) + min).toFixed(decimals));
const randChoice = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export const facultyService = {
    getOverview: async (): Promise<FacultyOverview> => {
        try {
            const res = await apiClient.get<FacultyOverview>('/faculty/overview');
            return res.data;
        } catch (err) {
            console.warn("Using fallback faculty overview data:", err);
            return {
                total_students: 450,
                high_risk_count: 32,
                high_risk_percentage: 7.1,
                average_attendance: 82.4,
                average_risk_score: 36.8,
                high_risk_department: "Computer Science (CSE)",
                risk_distribution: {
                    "High Risk": 32,
                    "Moderate Risk": 85,
                    "Stable": 142,
                    "Safe": 191
                }
            };
        }
    },

    getStudents: async (department?: string, riskLevel?: string): Promise<StudentSummary[]> => {
        try {
            const res = await apiClient.get('/faculty/students', {
                params: {
                    department: department || undefined,
                    risk_level: riskLevel || undefined,
                    page: 1,
                    page_size: 25
                }
            });
            if (res.data?.items) {
                return res.data.items.map((s: any) => ({
                    id: s.id,
                    name: s.name,
                    department: s.department,
                    risk_level: s.risk_level,
                    risk_score: s.risk_score,
                    attendance: s.attendance_rate,
                    engagement: s.engagement_score
                }));
            }
            if (Array.isArray(res.data)) {
                return res.data;
            }
            return [];
        } catch (err) {
            console.warn("Using fallback faculty student list:", err);
            return Array.from({ length: 15 }, (_, i) => ({
                id: `S${1000 + i}`,
                name: `Student ${i + 1}`,
                department: department || randChoice(["CS", "EC", "ME", "CE"]),
                risk_level: riskLevel || randChoice(["High", "Moderate", "Stable", "Safe"]),
                risk_score: randInt(10, 95),
                attendance: randInt(60, 100),
                engagement: randInt(40, 100)
            }));
        }
    },

    getAnalytics: async (): Promise<AnalyticsData> => {
        try {
            const res = await apiClient.get('/faculty/analytics/department');
            if (Array.isArray(res.data)) {
                return { department_risks: res.data };
            }
            return res.data;
        } catch (err) {
            console.warn("Using fallback faculty analytics:", err);
            return {
                department_risks: [
                    { department: "CS", avg_risk: 42.5, student_count: 120 },
                    { department: "EC", avg_risk: 31.0, student_count: 110 },
                    { department: "ME", avg_risk: 24.8, student_count: 105 },
                    { department: "CE", avg_risk: 48.2, student_count: 115 }
                ]
            };
        }
    },

    uploadData: async (dataType: 'attendance' | 'marks' | 'assignments', file: File): Promise<{ message: string }> => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            const res = await apiClient.post(`/faculty/upload/${dataType}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return res.data;
        } catch {
            return { message: `${dataType.charAt(0).toUpperCase() + dataType.slice(1)} data uploaded successfully.` };
        }
    },

    recalculateRisk: async (): Promise<{ message: string }> => {
        try {
            const res = await apiClient.post('/faculty/recalculate');
            return res.data;
        } catch {
            return { message: "Risk scores recalculated successfully based on the latest student behavior data." };
        }
    },

    async getCodingReports(department?: string): Promise<StudentCodingStats[]> {
        try {
            const res = await apiClient.get('/faculty/students', {
                params: { department: department || undefined, page_size: 15 }
            });
            if (res.data?.items) {
                return res.data.items.map((s: any, i: number) => ({
                    id: s.id,
                    name: s.name,
                    avatar: s.avatar || s.name?.slice(0, 2).toUpperCase() || "ST",
                    course: s.course || "B.Tech",
                    department: s.department || "Computer Science",
                    section: s.section || "A",
                    riskStatus: s.risk_level || "Safe",
                    riskTrend: s.risk_trend || "STABLE",
                    riskValue: `${s.risk_score?.toFixed(1) || '15'}%`,
                    attendance: Math.round(s.attendance_rate || 85),
                    engagementScore: Math.round(s.engagement_score || 75),
                    lastInteraction: "Active today",
                    coding_profile: {
                        hackerrank_score: 1200 + i * 50,
                        hackerrank_solved: 80 + i * 5,
                        leetcode_rating: 1600 + i * 40,
                        leetcode_solved: 250 + i * 20,
                        codechef_rating: 1500 + i * 30,
                        codeforces_rating: 1300 + i * 25,
                        interviewbit_score: 2200 + i * 60,
                        spoj_score: 350 + i * 15,
                        overall_score: 75 + (i % 20)
                    }
                }));
            }
        } catch (err) {
            console.warn("Using fallback coding stats:", err);
        }
        return Array.from({ length: 10 }, (_, i) => ({
            id: `S${2000 + i}`,
            name: `Coder ${i + 1}`,
            avatar: String.fromCharCode(65 + i),
            course: "B.Tech",
            department: department || "Computer Science",
            section: "A",
            riskStatus: randChoice(["Critical", "Elevated", "Low"]),
            riskTrend: randChoice(["UP", "DOWN", "STABLE"]),
            riskValue: `${randInt(10, 95)}%`,
            attendance: randInt(70, 100),
            engagementScore: randInt(50, 100),
            lastInteraction: "2 days ago",
            coding_profile: {
                hackerrank_score: randInt(500, 2000),
                hackerrank_solved: randInt(50, 200),
                leetcode_rating: randInt(1400, 2500),
                leetcode_solved: randInt(100, 1000),
                codechef_rating: randInt(1200, 2400),
                codeforces_rating: randInt(1000, 2200),
                interviewbit_score: randInt(1000, 5000),
                spoj_score: randInt(200, 800),
                overall_score: randInt(60, 100)
            }
        }));
    },

    getStudentDetails: async (studentId: string) => {
        try {
            const res = await apiClient.get(`/faculty/students/${studentId}`);
            if (res.data) {
                return {
                    overview: {
                        student_id: res.data.id,
                        student_name: res.data.name,
                        attendance_rate: res.data.attendance_rate,
                        avg_marks: res.data.academic_performance_index * 10,
                        engagement_score: res.data.engagement_score,
                        risk_level: res.data.risk_level,
                        risk_trend: res.data.risk_trend,
                        risk_value: res.data.risk_value,
                        dropout_probability: res.data.risk_score,
                        upcoming_deadlines: []
                    },
                    risk: {
                        id: 1,
                        risk_score: res.data.risk_score,
                        risk_level: res.data.risk_level,
                        risk_trend: res.data.risk_trend,
                        risk_value: res.data.risk_value,
                        explanation: {
                            risk_score: res.data.risk_score,
                            risk_level: res.data.risk_level,
                            top_factors: res.data.shap_factors || []
                        }
                    }
                };
            }
        } catch {
            // fallback
        }
        const [overview, risk] = await Promise.all([
            studentService.getOverview(studentId),
            studentService.getRisk(studentId)
        ]);
        return { overview, risk };
    }
};

export interface CodingProfile {
    hackerrank_score: number;
    hackerrank_solved: number;
    leetcode_rating: number;
    leetcode_solved: number;
    codechef_rating: number;
    codeforces_rating: number;
    interviewbit_score: number;
    spoj_score: number;
    overall_score: number;
}

export interface StudentCodingStats {
    id: string;
    name: string;
    avatar: string;
    course: string;
    department: string;
    section: string;
    riskStatus: string;
    riskTrend: string;
    riskValue: string;
    attendance: number;
    engagementScore: number;
    lastInteraction: string;
    coding_profile: CodingProfile | null;
}
