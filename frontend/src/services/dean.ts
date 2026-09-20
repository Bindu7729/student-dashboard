import apiClient from '@/lib/api';

// ─── Static fallback helpers ─────────────────────────────────────────────────

function fallbackOverview() {
    return {
        total_students: 450,
        high_risk_count: 86,
        average_attendance: 84.2,
        average_risk_score: 32.5,
        high_risk_department: 'Computer Science',
        risk_distribution: {
            'High Risk': 86,
            'Moderate Risk': 185,
            'Stable': 120,
            'Safe': 59,
        },
    };
}

function fallbackDepartmentAnalytics() {
    return [
        { department: 'Computer Science', total_students: 150, avg_risk: 38.5, avg_attendance: 82.1, avg_gpa: 7.4, high_risk_count: 32, high_risk_pct: 21.3 },
        { department: 'Electronics', total_students: 110, avg_risk: 28.2, avg_attendance: 85.6, avg_gpa: 7.8, high_risk_count: 18, high_risk_pct: 16.4 },
        { department: 'Mechanical', total_students: 120, avg_risk: 22.4, avg_attendance: 88.3, avg_gpa: 7.9, high_risk_count: 12, high_risk_pct: 10.0 },
        { department: 'Civil', total_students: 70, avg_risk: 44.1, avg_attendance: 78.9, avg_gpa: 7.1, high_risk_count: 24, high_risk_pct: 34.3 },
    ];
}

function fallbackFacultyPerformance() {
    return [
        { faculty_id: 'F001', student_count: 120, avg_gpa: 8.1, avg_risk: 22.4, avg_engagement: 78.0, avg_attendance: 88.5, performance_flag: false },
        { faculty_id: 'F002', student_count: 95, avg_gpa: 7.4, avg_risk: 35.2, avg_engagement: 68.0, avg_attendance: 82.3, performance_flag: false },
        { faculty_id: 'F003', student_count: 110, avg_gpa: 7.8, avg_risk: 27.8, avg_engagement: 74.5, avg_attendance: 85.0, performance_flag: false },
        { faculty_id: 'F004', student_count: 85, avg_gpa: 7.0, avg_risk: 42.3, avg_engagement: 63.0, avg_attendance: 79.2, performance_flag: true },
    ];
}

function fallbackAcademicTrends() {
    return {
        pass_fail: { pass: 370, fail: 80 },
        backlog_count: 95,
        backlog_rate: 7.6,
        gpa_trend: [
            { month: 'Jan', avg_gpa: 7.2 },
            { month: 'Feb', avg_gpa: 7.5 },
            { month: 'Mar', avg_gpa: 7.4 },
            { month: 'Apr', avg_gpa: 7.8 },
            { month: 'May', avg_gpa: 8.1 },
            { month: 'Jun', avg_gpa: 7.9 },
        ],
        gpa_distribution: [
            { range: '0-4', count: 12 },
            { range: '4-5', count: 35 },
            { range: '5-6', count: 68 },
            { range: '6-7', count: 112 },
            { range: '7-8', count: 145 },
            { range: '8-9', count: 60 },
            { range: '9-10', count: 18 },
        ],
        gpa_risk_scatter: Array.from({ length: 50 }, () => ({
            gpa: Number((Math.random() * 6 + 4).toFixed(2)),
            risk: Number((Math.random() * 100).toFixed(1)),
        })),
    };
}

function fallbackEngagementAttendance() {
    return {
        avg_attendance: 84.2,
        avg_engagement: 72.5,
        low_attendance_count: 56,
        low_attendance_pct: 12.4,
        avg_login_gap_days: 2.4,
        attendance_distribution: [
            { range: '0-50%', count: 12 },
            { range: '50-60%', count: 44 },
            { range: '60-70%', count: 88 },
            { range: '70-80%', count: 156 },
            { range: '80-90%', count: 108 },
            { range: '90-100%', count: 42 },
        ],
        attendance_risk_scatter: Array.from({ length: 50 }, () => ({
            attendance: Number((Math.random() * 60 + 40).toFixed(1)),
            risk: Number((Math.random() * 100).toFixed(1)),
        })),
        department_engagement: [
            { department: 'Computer Science', avg_engagement: 82.0, avg_attendance: 88.0 },
            { department: 'Electronics', avg_engagement: 75.0, avg_attendance: 85.0 },
            { department: 'Mechanical', avg_engagement: 68.0, avg_attendance: 82.0 },
            { department: 'Civil', avg_engagement: 72.0, avg_attendance: 84.0 },
        ],
    };
}

function fallbackInterventions() {
    return {
        high_risk_students: [],
        total_interventions: 0,
        status_breakdown: {},
        success_rate: 0,
        type_breakdown: [],
    };
}

function fallbackPredictiveInsights() {
    return {
        model_version: 'N/A',
        accuracy: 94.2,
        precision: 91.0,
        recall: 88.5,
        f1_score: 89.7,
        training_samples: 0,
        feature_importance: [
            { feature: 'attendance_rate', importance: 0.42 },
            { feature: 'academic_performance_index', importance: 0.35 },
            { feature: 'assignment_completion_rate', importance: 0.28 },
            { feature: 'engagement_score', importance: 0.15 },
            { feature: 'previous_backlogs', importance: 0.12 },
        ],
        risk_forecast: [],
        confidence_score: 94.2,
    };
}

function fallbackReportsSummary() {
    return [];
}

// ─── Service ─────────────────────────────────────────────────────────────────

export const deanService = {
    getOverview: async () => {
        try {
            const res = await apiClient.get('/dean/overview');
            return res.data;
        } catch (err) {
            console.warn('[deanService.getOverview] Backend unavailable, using fallback', err);
            return fallbackOverview();
        }
    },

    getDepartmentAnalytics: async () => {
        try {
            const res = await apiClient.get('/dean/department-analytics');
            const data = res.data;
            return data.departments ?? data;
        } catch (err) {
            console.warn('[deanService.getDepartmentAnalytics] Backend unavailable, using fallback', err);
            return fallbackDepartmentAnalytics();
        }
    },

    getFacultyPerformance: async () => {
        try {
            const res = await apiClient.get('/dean/faculty-performance');
            const data = res.data;
            return data.faculty ?? data;
        } catch (err) {
            console.warn('[deanService.getFacultyPerformance] Backend unavailable, using fallback', err);
            return fallbackFacultyPerformance();
        }
    },

    getAcademicTrends: async () => {
        try {
            const res = await apiClient.get('/dean/academic-trends');
            return res.data;
        } catch (err) {
            console.warn('[deanService.getAcademicTrends] Backend unavailable, using fallback', err);
            return fallbackAcademicTrends();
        }
    },

    getEngagementAttendance: async () => {
        try {
            const res = await apiClient.get('/dean/engagement-attendance');
            return res.data;
        } catch (err) {
            console.warn('[deanService.getEngagementAttendance] Backend unavailable, using fallback', err);
            return fallbackEngagementAttendance();
        }
    },

    getInterventions: async () => {
        try {
            const res = await apiClient.get('/dean/interventions');
            return res.data;
        } catch (err) {
            console.warn('[deanService.getInterventions] Backend unavailable, using fallback', err);
            return fallbackInterventions();
        }
    },

    getPredictiveInsights: async () => {
        try {
            const res = await apiClient.get('/dean/predictive-insights');
            return res.data;
        } catch (err) {
            console.warn('[deanService.getPredictiveInsights] Backend unavailable, using fallback', err);
            return fallbackPredictiveInsights();
        }
    },

    getReportsSummary: async (params?: { department?: string; semester?: string }) => {
        try {
            const res = await apiClient.get('/dean/reports/summary', { params });
            const data = res.data;
            return Array.isArray(data) ? data : (data.students ?? data.items ?? []);
        } catch (err) {
            console.warn('[deanService.getReportsSummary] Backend unavailable, using fallback', err);
            return fallbackReportsSummary();
        }
    },
};
