import apiClient from '@/lib/api';

export interface StudentOverview {
    student_id: string;
    student_name: string;
    attendance_rate: number;
    avg_marks: number;
    engagement_score: number;
    risk_level: string;
    risk_trend: string;
    risk_value: string;
    dropout_probability: number;
    upcoming_deadlines: any[];
    recent_attendance?: any[];
}

export interface Assignment {
    id: number;
    assessment_id: number;
    assessment: {
        id: number;
        course_id: string;
        course_name: string;
        title: string;
        total_marks: number;
        due_date: string;
        type: string;
    };
    obtained_marks: number | null;
    status: string;
    submission_date: string | null;
}

export interface AssignmentProgress {
    total: number;
    completed: number;
    pending: number;
    overdue: number;
    overdue_count: number;
    completion_percentage: number;
    assignments: Assignment[];
}

export interface RiskFactor {
    feature: string;
    impact: number;
    direction: 'positive' | 'negative';
}

export interface RiskDetails {
    id: number;
    risk_score: number;
    risk_level: string;
    risk_trend: string;
    risk_value: string;
    explanation: {
        risk_score: number;
        risk_level: string;
        top_factors: RiskFactor[];
    };
}

export interface SubjectPerformance {
    course_id: string;
    course_name: string;
    credits: number;
    internal_marks: number;
    external_marks: number;
    total_marks: number;
    grade: string;
    attendance_percentage: number;
}

export interface SemesterPerformance {
    semester: number;
    gpa: number;
    subjects: SubjectPerformance[];
}

export interface AttendanceRecord {
    id: number;
    course_id: string;
    course_name: string;
    date: string;
    status: string;
}

// ─── Static fallback helpers ─────────────────────────────────────────────────

const BTECH_COURSES = [
    { id: 'CS101', name: 'Data Structures & Algorithms' },
    { id: 'CS201', name: 'Operating Systems' },
    { id: 'CS301', name: 'Database Management Systems' },
    { id: 'CS401', name: 'Machine Learning' },
    { id: 'CS501', name: 'Computer Networks' },
    { id: 'EC101', name: 'Digital Logic Design' },
    { id: 'HU101', name: 'Professional Communication' },
    { id: 'MA101', name: 'Engineering Mathematics' },
];

const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const randFloat = (min: number, max: number, decimals = 2) => Number((Math.random() * (max - min) + min).toFixed(decimals));
const randChoice = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

function fallbackOverview(studentId: string): StudentOverview {
    return {
        attendance_rate: 78.5,
        avg_marks: 72.4,
        engagement_score: 65.0,
        risk_level: 'Moderate Risk',
        risk_trend: 'stable',
        risk_value: 'fallback',
        dropout_probability: 14.2,
        student_id: studentId,
        student_name: 'Student',
        upcoming_deadlines: [
            {
                id: 1,
                course_id: 'CS101',
                course_name: 'Data Structures & Algorithms',
                title: 'Assignment 3: Graph Traversal',
                due_date: new Date(Date.now() + 2 * 86400000).toISOString(),
                type: 'Assignment',
            },
        ],
        recent_attendance: [
            { id: 101, course_name: 'Computer Networks', date: new Date().toISOString(), status: 'Present' },
            { id: 102, course_name: 'Data Structures', date: new Date(Date.now() - 86400000).toISOString(), status: 'Present' },
            { id: 103, course_name: 'Machine Learning', date: new Date(Date.now() - 2 * 86400000).toISOString(), status: 'Absent' },
        ],
    };
}

function fallbackPerformance(): SemesterPerformance[] {
    const semesters: SemesterPerformance[] = [];
    let gpa = 8.0;
    for (let sem = 1; sem <= 6; sem++) {
        gpa = Math.max(5.0, Math.min(10.0, gpa + randFloat(-0.5, 0.5)));
        const subjects: SubjectPerformance[] = BTECH_COURSES.slice(0, 4).map((c) => {
            const internal = randInt(20, 40);
            const external = randInt(30, 60);
            const total = internal + external;
            let grade = 'C';
            if (total >= 90) grade = 'A+';
            else if (total >= 80) grade = 'A';
            else if (total >= 70) grade = 'B';
            else if (total < 50) grade = 'F';
            return { course_id: c.id, course_name: c.name, credits: randInt(2, 4), internal_marks: internal, external_marks: external, total_marks: total, grade, attendance_percentage: randInt(65, 100) };
        });
        semesters.push({ semester: sem, gpa: parseFloat(gpa.toFixed(2)), subjects });
    }
    return semesters.sort((a, b) => b.semester - a.semester);
}

function fallbackAttendance(): AttendanceRecord[] {
    const records: AttendanceRecord[] = [];
    let idCounter = 1;
    for (let day = 0; day < 30; day++) {
        if (day % 7 === 0 || day % 7 === 6) continue;
        const date = new Date(Date.now() - day * 86400000);
        for (let c = 0; c < randInt(2, 3); c++) {
            const course = randChoice(BTECH_COURSES);
            records.push({ id: idCounter++, course_id: course.id, course_name: course.name, date: new Date(date.setHours(randInt(8, 16), 0, 0)).toISOString(), status: randChoice(['Present', 'Present', 'Present', 'Late', 'Absent']) });
        }
    }
    return records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

function fallbackAssignments(): AssignmentProgress {
    return {
        total: 24, completed: 18, pending: 6, overdue: 2, overdue_count: 2, completion_percentage: 75,
        assignments: [
            { id: 1, assessment_id: 101, assessment: { id: 101, course_id: 'CS401', course_name: 'Machine Learning', title: 'Neural Network Implementation', total_marks: 100, due_date: new Date(Date.now() - 5 * 86400000).toISOString(), type: 'Project' }, obtained_marks: 92, status: 'Graded', submission_date: new Date(Date.now() - 6 * 86400000).toISOString() },
            { id: 2, assessment_id: 102, assessment: { id: 102, course_id: 'CS201', course_name: 'Operating Systems', title: 'Memory Management Simulation', total_marks: 50, due_date: new Date(Date.now() + 3 * 86400000).toISOString(), type: 'Assignment' }, obtained_marks: null, status: 'Pending', submission_date: null },
            { id: 3, assessment_id: 103, assessment: { id: 103, course_id: 'MA101', course_name: 'Engineering Mathematics', title: 'Linear Algebra Problem Set 4', total_marks: 30, due_date: new Date(Date.now() - 2 * 86400000).toISOString(), type: 'Homework' }, obtained_marks: null, status: 'Overdue', submission_date: null },
        ],
    };
}

function fallbackRisk(): RiskDetails {
    return {
        id: 1, risk_score: 28.5, risk_level: 'Moderate Risk', risk_trend: 'stable', risk_value: 'fallback',
        explanation: {
            risk_score: 28.5, risk_level: 'Moderate Risk',
            top_factors: [
                { feature: 'attendance_rate', impact: -0.15, direction: 'negative' },
                { feature: 'academic_performance_index', impact: 0.22, direction: 'positive' },
                { feature: 'engagement_score', impact: -0.08, direction: 'negative' },
            ],
        },
    };
}

// ─── Service ─────────────────────────────────────────────────────────────────

export const studentService = {
    getOverview: async (studentId: string): Promise<StudentOverview> => {
        try {
            const res = await apiClient.get(`/student/${studentId}/overview`);
            return res.data as StudentOverview;
        } catch (err) {
            console.warn('[studentService.getOverview] Backend unavailable, using fallback', err);
            return fallbackOverview(studentId);
        }
    },

    getPerformance: async (studentId: string): Promise<SemesterPerformance[]> => {
        try {
            const res = await apiClient.get(`/student/${studentId}/performance`);
            const data = res.data;
            // Backend returns { semesters: [...] } or array directly
            return Array.isArray(data) ? data : (data.semesters ?? data);
        } catch (err) {
            console.warn('[studentService.getPerformance] Backend unavailable, using fallback', err);
            return fallbackPerformance();
        }
    },

    getAttendance: async (studentId: string): Promise<AttendanceRecord[]> => {
        try {
            const res = await apiClient.get(`/student/${studentId}/attendance`);
            const data = res.data;
            return Array.isArray(data) ? data : (data.records ?? data.attendance ?? []);
        } catch (err) {
            console.warn('[studentService.getAttendance] Backend unavailable, using fallback', err);
            return fallbackAttendance();
        }
    },

    getAssignments: async (studentId: string): Promise<AssignmentProgress> => {
        try {
            const res = await apiClient.get(`/student/${studentId}/assignments`);
            return res.data as AssignmentProgress;
        } catch (err) {
            console.warn('[studentService.getAssignments] Backend unavailable, using fallback', err);
            return fallbackAssignments();
        }
    },

    getRisk: async (studentId: string): Promise<RiskDetails> => {
        try {
            const res = await apiClient.get(`/student/${studentId}/risk`);
            return res.data as RiskDetails;
        } catch (err) {
            console.warn('[studentService.getRisk] Backend unavailable, using fallback', err);
            return fallbackRisk();
        }
    },
};
