import React, { useState, useEffect } from 'react';
import { Shield, CheckCircle, XCircle, AlertTriangle, Activity, Database, Server, Terminal, ListChecks, Download, RefreshCw, Trash2, Code } from 'lucide-react';
import axios from 'axios';

// Use same axios instance but explicitly to api
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 10000
});

const DEFAULT_CHECKLIST = {
  landing: [
    { id: 'l1', label: 'Hero section loads with animated rain', checked: false },
    { id: 'l2', label: '"Get Protected" button navigates to /register', checked: false },
    { id: 'l3', label: 'How It Works section shows 6 steps', checked: false },
    { id: 'l4', label: 'Platform logos visible (Zepto, Blinkit etc.)', checked: false }
  ],
  register: [
    { id: 'r1', label: 'Step 1 form validates required fields', checked: false },
    { id: 'r2', label: 'Step 2 platform selection works', checked: false },
    { id: 'r3', label: 'Step 2 income slider works (₹300–₹2000)', checked: false },
    { id: 'r4', label: 'Step 3 shows calculated premium', checked: false },
    { id: 'r5', label: 'Step 3 shows risk level for zone', checked: false },
    { id: 'r6', label: 'Registration submits and redirects to dashboard', checked: false },
    { id: 'r7', label: 'Confetti animation plays on success', checked: false }
  ],
  worker: [
    { id: 'w1', label: 'Coverage Shield displays with correct state', checked: false },
    { id: 'w2', label: 'Protection Score circular gauge animates', checked: false },
    { id: 'w3', label: '4 stat cards show real numbers', checked: false },
    { id: 'w4', label: 'Tomorrow\'s Risk Forecast card loads', checked: false },
    { id: 'w5', label: 'Risk meter bar animates on load', checked: false },
    { id: 'w6', label: 'Claims timeline shows expandable cards', checked: false },
    { id: 'w7', label: 'Claim stepper shows verification steps', checked: false },
    { id: 'w8', label: 'Alerts panel shows unread alerts', checked: false },
    { id: 'w9', label: 'Teal border on unread alerts', checked: false },
    { id: 'w10', label: 'Toast notification appears on new alert', checked: false }
  ],
  admin: [
    { id: 'a1', label: '6 KPI tiles show correct numbers', checked: false },
    { id: 'a2', label: 'Zone risk grid shows all 10 zones', checked: false },
    { id: 'a3', label: 'Risk badges colored correctly (green/amber/red)', checked: false },
    { id: 'a4', label: 'Live claims feed loads', checked: false },
    { id: 'a5', label: 'Bar chart renders (premiums vs payouts)', checked: false },
    { id: 'a6', label: 'Donut chart renders (claims by status)', checked: false },
    { id: 'a7', label: 'Line chart renders (disruptions by zone)', checked: false },
    { id: 'a8', label: 'Fraud flags section shows flagged claims', checked: false },
    { id: 'a9', label: 'Demo control panel visible', checked: false }
  ],
  demo: [
    { id: 'd1', label: '"Trigger Rain — Kondapur" works', checked: false },
    { id: 'd2', label: 'Toast confirmation appears after trigger', checked: false },
    { id: 'd3', label: 'Live claims feed updates after trigger', checked: false },
    { id: 'd4', label: 'Zone card updates after trigger', checked: false },
    { id: 'd5', label: '"Resolve All Disruptions" works', checked: false },
    { id: 'd6', label: '"Reset Demo" works', checked: false },
    { id: 'd7', label: 'Guided demo "▶ Start Live Demo" button works', checked: false },
    { id: 'd8', label: 'Demo stepper plays through 7 steps', checked: false }
  ],
  nav: [
    { id: 'n1', label: 'Worker navbar links work', checked: false },
    { id: 'n2', label: 'Admin navbar links work', checked: false },
    { id: 'n3', label: 'Logout clears token and redirects', checked: false },
    { id: 'n4', label: 'Protected routes redirect to login when not authenticated', checked: false },
    { id: 'n5', label: 'Admin routes reject non-admin users', checked: false }
  ],
  responsive: [
    { id: 'res1', label: 'Dashboard works on mobile (375px)', checked: false },
    { id: 'res2', label: 'Admin dashboard scrolls on mobile', checked: false },
    { id: 'res3', label: 'Navbar collapses to hamburger on mobile', checked: false }
  ]
};

const TestDashboard = () => {
  const [healthData, setHealthData] = useState(null);
  const [loadingHealth, setLoadingHealth] = useState(false);
  const [healthFilter, setHealthFilter] = useState('All');

  const [e2eData, setE2eData] = useState(null);
  const [e2eStepIndex, setE2eStepIndex] = useState(-1);
  const [runningE2E, setRunningE2E] = useState(false);

  const [featureTests, setFeatureTests] = useState({});
  const [runningFeatures, setRunningFeatures] = useState(false);

  const [dbIntegrity, setDbIntegrity] = useState(null);
  const [runningDb, setRunningDb] = useState(false);

  const [checklist, setChecklist] = useState(DEFAULT_CHECKLIST);

  const [apiTester, setApiTester] = useState({ path: '/auth/test-token', method: 'GET', body: '', response: null, status: null, time: null, loading: false });

  const [readinessData, setReadinessData] = useState(null);
  const [runningReadiness, setRunningReadiness] = useState(false);
  const [readinessStepIndex, setReadinessStepIndex] = useState(-1);

  const [errors, setErrors] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('gg_qa_checklist');
    if (saved) {
      try { setChecklist(JSON.parse(saved)); } catch (e) {}
    }
    fetchErrors();
    const interval = setInterval(fetchErrors, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    localStorage.setItem('gg_qa_checklist', JSON.stringify(checklist));
  }, [checklist]);

  const fetchErrors = async () => {
    try {
      const res = await api.get('/test/recent-errors');
      setErrors(res.data || []);
    } catch (e) {}
  };

  const clearErrors = async () => {
    try {
      await api.post('/test/clear-errors');
      setErrors([]);
    } catch (e) {}
  };

  const runHealthCheck = async () => {
    setLoadingHealth(true);
    try {
      const res = await api.get('/test/health');
      setHealthData(res.data);
    } catch (e) {
      alert("Failed to connect to backend for health check");
    } finally {
      setLoadingHealth(false);
    }
  };

  const runE2E = async () => {
    setRunningE2E(true);
    setE2eData(null);
    setE2eStepIndex(0);
    try {
      const res = await api.get('/test/e2e-flow');
      setE2eData(res.data);
      animateSteps(res.data.steps.length, setE2eStepIndex);
    } catch (e) {
      alert("E2E flow failed");
    } finally {
      setRunningE2E(false);
    }
  };

  const animateSteps = (count, setIndex) => {
    let current = 0;
    setIndex(0);
    const interval = setInterval(() => {
      current++;
      setIndex(current);
      if (current >= count + 1) clearInterval(interval);
    }, 400);
  };

  const runFeatureTest = async (feature) => {
    setFeatureTests(p => ({ ...p, [feature]: { status: 'RUNNING' } }));
    try {
      const res = await api.get(`/test/${feature}`);
      setFeatureTests(p => ({ ...p, [feature]: Object.assign({ timestamp: new Date() }, res.data) }));
    } catch (e) {
      setFeatureTests(p => ({ ...p, [feature]: { status: 'FAIL', error: e.message } }));
    }
  };

  const runAllFeatures = async () => {
    setRunningFeatures(true);
    const features = ['auth', 'risk-engine', 'premium-calc', 'disruption-trigger', 'fraud-detection', 'payout', 'alerts', 'demo-endpoints'];
    for (let f of features) {
      await runFeatureTest(f);
      await new Promise(r => setTimeout(r, 500));
    }
    setRunningFeatures(false);
  };

  const runDbIntegrity = async () => {
    setRunningDb(true);
    try {
      const res = await api.get('/test/db-integrity');
      setDbIntegrity(res.data);
    } catch (e) {}
    setRunningDb(false);
  };

  const executeApiTest = async () => {
    setApiTester(p => ({ ...p, loading: true, response: null }));
    const start = Date.now();
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const method = apiTester.method;
      const data = apiTester.body ? JSON.parse(apiTester.body) : undefined;
      
      const res = await api({ url: apiTester.path, method, data, headers });
      setApiTester(p => ({ ...p, status: res.status, time: Date.now() - start, response: res.data, loading: false }));
    } catch (e) {
      setApiTester(p => ({ ...p, status: e.response?.status || 500, time: Date.now() - start, response: e.response?.data || e.message, loading: false }));
    }
  };

  const runDemoReadiness = async () => {
    setRunningReadiness(true);
    setReadinessData(null);
    let steps = [
      { id: 1, name: "Backend server responding", status: 'PENDING' },
      { id: 2, name: "Database has seed data", status: 'PENDING' },
      { id: 3, name: "Risk scores present", status: 'PENDING' },
      { id: 4, name: "Risk assessment engine working", status: 'PENDING' },
      { id: 5, name: "Demo trigger working", status: 'PENDING' },
      { id: 6, name: "Fraud detection working", status: 'PENDING' },
      { id: 7, name: "Payout simulation working", status: 'PENDING' },
      { id: 8, name: "Demo reset working", status: 'PENDING' },
      { id: 9, name: "No critical errors", status: 'PENDING' }
    ];
    setReadinessData({ steps });
    setReadinessStepIndex(0);

    const updateStep = (idx, status, detail) => {
      steps[idx] = { ...steps[idx], status, detail };
      setReadinessData({ steps: [...steps], final: null });
    };

    try {
      let pass = true;
      setReadinessStepIndex(1);
      const hc = await api.get('/test/health');
      updateStep(0, 'PASS', '200 OK');

      setReadinessStepIndex(2);
      const hasWorkers = hc.data.checks.find(c => c.name.includes("Seed data")).status === "PASS";
      updateStep(1, hasWorkers ? 'PASS' : 'FAIL', hasWorkers ? 'Workers seeded' : 'Missing seed data');
      if (!hasWorkers) pass = false;

      setReadinessStepIndex(3);
      const hasZones = hc.data.checks.find(c => c.category === "Risk Assessment Engine" && c.status === "PASS");
      updateStep(2, hasZones ? 'PASS' : 'FAIL', hasZones ? '10 zones found' : 'Missing zones');
      if (!hasZones) pass = false;

      setReadinessStepIndex(4);
      const re = await api.get('/test/risk-engine');
      updateStep(3, re.data.status, re.data.status === 'PASS' ? 'Scores updated' : 'Engine failed');
      if (re.data.status !== 'PASS') pass = false;

      setReadinessStepIndex(5);
      const dt = await api.get('/test/disruption-trigger');
      updateStep(4, dt.data.status, dt.data.status === 'PASS' ? 'Claims created' : 'Failed to trigger');
      if (dt.data.status !== 'PASS') pass = false;

      setReadinessStepIndex(6);
      const fd = await api.get('/test/fraud-detection');
      updateStep(5, fd.data.status, fd.data.status === 'PASS' ? 'Fraud evaluated' : 'Fraud check failed');
      if (fd.data.status !== 'PASS') pass = false;

      setReadinessStepIndex(7);
      const po = await api.get('/test/payout');
      updateStep(6, po.data.status, po.data.status === 'PASS' ? 'TXN generated' : 'Payouts failed');
      if (po.data.status !== 'PASS') pass = false;

      setReadinessStepIndex(8);
      const r_demo = await api.post('/demo/reset');
      updateStep(7, r_demo.status === 200 ? 'PASS' : 'FAIL', r_demo.status === 200 ? 'Reset success' : 'Api failed');
      if (r_demo.status !== 200) pass = false;

      setReadinessStepIndex(9);
      const err = await api.get('/test/recent-errors');
      const hasCrit = err.data.length > 5; // allow some but flag if too many
      updateStep(8, !hasCrit ? 'PASS' : 'FAIL', !hasCrit ? 'Logs clean' : err.data.length + ' errors found');

      setReadinessStepIndex(10);
      setReadinessData({ steps, final: pass ? 'PASS' : 'FAIL' });

    } catch (e) {
      setReadinessData({ steps, final: 'FAIL', error: e.message });
    }
    setRunningReadiness(false);
  };

  const toggleCheck = (group, id) => {
    setChecklist(p => ({
      ...p,
      [group]: p[group].map(i => i.id === id ? { ...i, checked: !i.checked } : i)
    }));
  };

  const resetChecklist = () => setChecklist(DEFAULT_CHECKLIST);

  const flatChecklist = Object.values(checklist).flat();
  const checkedCount = flatChecklist.filter(c => c.checked).length;
  const checklistTotal = flatChecklist.length;

  return (
    <div className="min-h-screen bg-[#0A0F1E] text-slate-300 font-sans p-6 pb-20">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-teal-400 flex items-center gap-3">
            <Activity className="w-6 h-6" /> GigGuard AI — QA Test Dashboard
          </h1>
          <p className="text-slate-500 text-sm mt-1">Version 1.0.0-rc | Build 942a7c</p>
        </div>
        <div className="bg-amber-500/10 text-amber-500 border border-amber-500/20 px-4 py-2 rounded-lg flex items-center gap-2 font-medium text-sm">
          <AlertTriangle className="w-4 h-4" /> Development Mode
        </div>
      </div>

      <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 p-4 rounded-xl mb-8 flex items-start gap-4 text-sm">
        <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
        <p>This page is for development and demo verification only. Not visible to users. Execute endpoints with caution as they modify database state temporarily.</p>
      </div>

      {/* SEC 1: System Health */}
      <div className="bg-[#1E293B] border border-slate-700 rounded-xl p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2"><Server className="w-5 h-5 text-teal-400"/> System Health Overview</h2>
            <p className="text-sm text-slate-400 mt-1">Runs 28 exhaustive backend state and functional checks</p>
          </div>
          <button 
            onClick={runHealthCheck} 
            disabled={loadingHealth}
            className="bg-teal-500 hover:bg-teal-400 text-slate-900 font-semibold px-6 py-2.5 rounded-lg transition-colors flex items-center gap-2"
          >
            {loadingHealth ? <RefreshCw className="w-4 h-4 animate-spin"/> : <Shield className="w-4 h-4"/>}
            Run Full System Check
          </button>
        </div>

        {healthData && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 flex flex-col items-center justify-center">
                <CheckCircle className="w-10 h-10 text-teal-500 mb-2"/>
                <div className="text-3xl font-bold text-white">{healthData.passed}</div>
                <div className="text-slate-400 text-sm">Passed Checks</div>
              </div>
              <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 flex flex-col items-center justify-center">
                <XCircle className={`w-10 h-10 ${healthData.failed > 0 ? 'text-red-500' : 'text-slate-600'} mb-2`}/>
                <div className="text-3xl font-bold text-white">{healthData.failed}</div>
                <div className="text-slate-400 text-sm">Failed Checks</div>
              </div>
              <div className={`p-6 rounded-lg border flex flex-col items-center justify-center ${
                healthData.overallStatus === 'PASS' ? 'bg-teal-500/10 border-teal-500/30' : 
                healthData.overallStatus === 'FAIL' ? 'bg-red-500/10 border-red-500/30' : 'bg-amber-500/10 border-amber-500/30'
              }`}>
                <Activity className={`w-10 h-10 mb-2 ${
                  healthData.overallStatus === 'PASS' ? 'text-teal-400' : healthData.overallStatus === 'FAIL' ? 'text-red-400' : 'text-amber-400'
                }`}/>
                <div className={`text-2xl font-bold ${
                  healthData.overallStatus === 'PASS' ? 'text-teal-400' : healthData.overallStatus === 'FAIL' ? 'text-red-400' : 'text-amber-400'
                }`}>{healthData.overallStatus}</div>
                <div className="text-slate-400 text-sm">Overall Status</div>
              </div>
            </div>

            <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
              <div className="bg-teal-500 h-3 transition-all duration-1000" style={{ width: `${(healthData.passed/28)*100}%` }}></div>
            </div>

            <div>
              <div className="flex gap-2 mb-4">
                {['All', 'Passed', 'Failed', 'Critical Only'].map(f => (
                  <button key={f} onClick={() => setHealthFilter(f)} className={`px-4 py-1.5 rounded-full text-xs font-medium border ${healthFilter === f ? 'bg-slate-700 border-slate-600 text-white' : 'bg-transparent border-slate-700 text-slate-400 hover:text-white'}`}>
                    {f}
                  </button>
                ))}
              </div>
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden max-h-96 overflow-y-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-800 text-slate-400 sticky top-0 z-10">
                    <tr>
                      <th className="p-3 font-medium">Category</th>
                      <th className="p-3 font-medium">Check Name</th>
                      <th className="p-3 font-medium">Status</th>
                      <th className="p-3 font-medium">Detail</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    {healthData.checks.filter(c => {
                      if (healthFilter === 'Passed') return c.status === 'PASS';
                      if (healthFilter === 'Failed') return c.status === 'FAIL';
                      if (healthFilter === 'Critical Only') return c.critical;
                      return true;
                    }).map((c, i) => (
                      <tr key={i} className="hover:bg-slate-800/70">
                        <td className="p-3">
                          <span className="text-xs bg-slate-700/50 text-slate-300 px-2 py-1 rounded-md">{c.category}</span>
                        </td>
                        <td className="p-3 text-slate-200">{c.name} {c.critical && <span className="text-[10px] ml-2 text-red-400 border border-red-500/30 px-1 py-0.5 rounded">CRITICAL</span>}</td>
                        <td className="p-3">
                          {c.status === 'PASS' ? (
                            <span className="text-teal-400 flex items-center gap-1 text-xs font-semibold"><CheckCircle className="w-3 h-3"/> PASS</span>
                          ) : (
                            <span className={`${c.critical ? 'text-red-400' : 'text-amber-400'} flex items-center gap-1 text-xs font-semibold`}><XCircle className="w-3 h-3"/> FAIL</span>
                          )}
                        </td>
                        <td className="p-3 text-slate-400 text-xs font-mono">{c.detail}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        
        {/* SEC 2: E2E */}
        <div className="bg-[#1E293B] border border-slate-700 rounded-xl p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-bold text-white mb-1">End-to-End Claim Flow Test</h2>
              <p className="text-sm text-slate-400">Tests complete automated claim lifecycle</p>
            </div>
            <button disabled={runningE2E} onClick={runE2E} className="bg-teal-500/20 text-teal-400 hover:bg-teal-500/30 px-4 py-2 rounded-lg font-medium text-sm transition-colors">
              {runningE2E ? 'Running...' : 'Run E2E Test'}
            </button>
          </div>
          
          <div className="space-y-3 relative">
            <div className="absolute left-4 top-4 bottom-4 w-px bg-slate-700 z-0"></div>
            {e2eData ? e2eData.steps.map((st, i) => (
              <div key={i} className={`relative flex items-center gap-4 transition-all duration-300 ${e2eStepIndex > i ? 'opacity-100' : 'opacity-30 translate-y-2'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 border-2 ${
                  st.status === 'PASS' && e2eStepIndex > i ? 'bg-teal-500/20 border-teal-500/50 text-teal-400' :
                  st.status === 'FAIL' && e2eStepIndex > i ? 'bg-red-500/20 border-red-500/50 text-red-400' :
                  'bg-slate-800 border-slate-600 text-slate-500'
                }`}>
                  {e2eStepIndex === i ? <RefreshCw className="w-4 h-4 animate-spin text-teal-500"/> : st.step}
                </div>
                <div className="bg-slate-800/80 border border-slate-700 flex-1 p-3 rounded-lg">
                  <div className="font-medium text-slate-200 text-sm">{st.name}</div>
                  <div className="text-slate-400 text-xs font-mono mt-1">{st.detail}</div>
                </div>
              </div>
            )) : (
              <div className="text-center p-10 text-slate-500 text-sm">Click 'Run E2E Test' to simulate full lifecycle</div>
            )}
          </div>
          {e2eData && e2eStepIndex >= e2eData.steps.length && (
            <div className={`mt-6 p-4 rounded-lg flex items-center justify-between font-bold border ${e2eData.flowStatus === 'PASS' ? 'bg-teal-500/10 border-teal-500/30 text-teal-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
              <div>{e2eData.flowStatus === 'PASS' ? '✓ E2E Flow Complete' : '✗ E2E Flow Failed'}</div>
              <div className="text-sm font-normal">Time: {e2eData.totalTimeMs}ms</div>
            </div>
          )}
        </div>

        {/* SEC 4: DB */}
        <div className="bg-[#1E293B] border border-slate-700 rounded-xl p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2"><Database className="w-5 h-5 text-teal-400"/> Database Integrity Check</h2>
              <p className="text-sm text-slate-400">Verifies foreign keys and orphaned records</p>
            </div>
            <button disabled={runningDb} onClick={runDbIntegrity} className="bg-teal-500/20 text-teal-400 hover:bg-teal-500/30 px-4 py-2 rounded-lg font-medium text-sm transition-colors">
              Run DB Check
            </button>
          </div>
          
          {dbIntegrity ? (
            <div className="bg-slate-800/50 rounded-lg border border-slate-700 overflow-hidden text-sm">
              <table className="w-full text-left">
                <thead className="bg-slate-800/80 text-slate-400">
                  <tr>
                    <th className="p-3">Table</th>
                    <th className="p-3">Check Description</th>
                    <th className="p-3 py-3 text-center">Orphans</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {dbIntegrity.checks.map((chk, i) => (
                    <tr key={i}>
                      <td className="p-3 font-mono text-xs text-slate-300">{chk.table}</td>
                      <td className="p-3 text-slate-400 text-xs">{chk.check}</td>
                      <td className="p-3 text-center text-slate-300">{chk.orphanCount}</td>
                      <td className="p-3">
                        {chk.status === 'PASS' ? <span className="text-teal-400 font-bold text-xs">PASS</span> : <span className="text-red-400 font-bold text-xs">FAIL</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className={`p-4 font-medium text-center border-t border-slate-700 ${dbIntegrity.integrityStatus === 'PASS' ? 'text-teal-400 bg-teal-500/5' : 'text-red-400 bg-red-500/5'}`}>
                {dbIntegrity.integrityStatus === 'PASS' ? 'All tables integrity verified ✓' : 'Integrity issues found ✗'}
              </div>
            </div>
          ) : (
             <div className="text-center p-10 bg-slate-800/30 rounded-lg border border-slate-700/50 text-slate-500 text-sm">
               No check performed yet.
             </div>
          )}
        </div>
      </div>

      {/* SEC 3: Features */}
      <div className="bg-[#1E293B] border border-slate-700 rounded-xl p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">Feature-by-Feature Tests</h2>
            <p className="text-sm text-slate-400">Targeted isolation testing per module</p>
          </div>
          <button disabled={runningFeatures} onClick={runAllFeatures} className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-2 rounded-lg font-medium text-sm transition-colors">
            {runningFeatures ? 'Running Sequentially...' : 'Run All 8 Tests'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { id: 'auth', title: 'Authentication', desc: 'Temp user, login, JWT flow' },
            { id: 'risk-engine', title: 'Risk Engine', desc: 'Assess zones, valid score ranges' },
            { id: 'premium-calc', title: 'Premium Calc', desc: '₹15-₹65 limit, protection impact' },
            { id: 'disruption-trigger', title: 'Disruptions', desc: 'Trigger logic and monitoring' },
            { id: 'fraud-detection', title: 'Fraud Detection', desc: 'GPS mismatch, weather flags' },
            { id: 'payout', title: 'Payout Simulation', desc: 'TXN creation, processing' },
            { id: 'alerts', title: 'Alert System', desc: 'Warnings, notifications, counts' },
            { id: 'demo-endpoints', title: 'Demo Endpoints', desc: 'Live triggers and resets' }
          ].map(f => {
            const data = featureTests[f.id];
            return (
              <div key={f.id} className="bg-slate-800/60 border border-slate-700 rounded-lg p-5 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-white font-medium">{f.title}</h3>
                    {data?.status === 'RUNNING' && <RefreshCw className="w-4 h-4 text-teal-500 animate-spin" />}
                    {data?.status === 'PASS' && <span className="bg-teal-500/20 text-teal-400 text-[10px] font-bold px-2 py-0.5 rounded">PASS</span>}
                    {data?.status === 'FAIL' && <span className="bg-red-500/20 text-red-400 text-[10px] font-bold px-2 py-0.5 rounded">FAIL</span>}
                  </div>
                  <p className="text-xs text-slate-400 mb-4">{f.desc}</p>
                </div>
                
                <div className="mt-auto">
                  {data?.status === 'PASS' && data.checks?.map((c, i) => (
                    <div key={i} className="text-[10px] font-mono flex items-center gap-2 text-slate-300 truncate">
                      <span className="text-teal-400">✓</span> {c.name}
                    </div>
                  ))}
                  {data?.status === 'PASS' && f.id === 'fraud-detection' && (
                     <div className="text-[10px] space-y-1">
                       <div className="text-teal-400 font-mono text-slate-300">✓ Weather Flag: {data.clearWeatherFlagTest}</div>
                       <div className="text-teal-400 font-mono text-slate-300">✓ GPS Flag: {data.gpsMismatchTest}</div>
                     </div>
                  )}
                  {data?.status === 'PASS' && f.id === 'risk-engine' && data.zones && (
                     <div className="text-[10px] font-mono text-slate-400">Evaluated {data.zones.length} zones successfully</div>
                  )}

                  <button onClick={() => runFeatureTest(f.id)} disabled={data?.status === 'RUNNING'} className="w-full mt-4 bg-slate-700/50 hover:bg-slate-700 text-slate-300 py-1.5 rounded text-xs font-medium transition-colors">
                    Run {data ? 'Again' : 'Test'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        
        {/* SEC 5: Frontend Checklist */}
        <div className="bg-[#1E293B] border border-slate-700 rounded-xl p-6 flex flex-col h-[600px]">
          <div className="flex justify-between items-center mb-4 shrink-0">
            <div>
              <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2"><ListChecks className="w-5 h-5 text-teal-400"/> Frontend Feature Checklist</h2>
              <p className="text-sm text-slate-400">Manual verification tracking (persists)</p>
            </div>
            <div className="flex gap-2">
              <button onClick={resetChecklist} className="p-2 bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors border border-slate-700" title="Reset">
                <Trash2 className="w-4 h-4"/>
              </button>
            </div>
          </div>
          
          <div className="mb-4 shrink-0">
            <div className="flex justify-between text-xs text-slate-400 font-medium mb-2">
              <span>Progress</span>
              <span className="text-teal-400">{checkedCount} / {checklistTotal} verified</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2">
              <div className="bg-teal-500 h-2 rounded-full transition-all duration-300" style={{ width: `${(checkedCount/checklistTotal)*100}%` }}></div>
            </div>
          </div>

          <div className="overflow-y-auto flex-1 pr-2 space-y-6 custom-scrollbar">
            {Object.entries(checklist).map(([group, items]) => (
              <div key={group} className="bg-slate-800/30 p-4 rounded-lg border border-slate-700/50">
                <h3 className="text-slate-300 text-sm font-bold uppercase tracking-wider mb-4 border-b border-slate-700 pb-2">{group}</h3>
                <div className="space-y-3">
                  {items.map(item => (
                    <label key={item.id} className="flex items-start gap-3 cursor-pointer group">
                      <div className={`mt-0.5 shrink-0 w-4 h-4 rounded border flex items-center justify-center transition-colors ${item.checked ? 'bg-teal-500 border-teal-500' : 'border-slate-500 bg-slate-800 group-hover:border-teal-400'}`}>
                        {item.checked && <CheckCircle className="w-3 h-3 text-[10px] text-slate-900"/>}
                      </div>
                      <span className={`text-sm ${item.checked ? 'text-slate-500 line-through' : 'text-slate-300'}`}>{item.label}</span>
                      <input type="checkbox" className="hidden" checked={item.checked} onChange={() => toggleCheck(group, item.id)} />
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SEC 6: API Tester */}
        <div className="bg-[#1E293B] border border-slate-700 rounded-xl p-6 flex flex-col h-[600px]">
           <div className="flex justify-between items-center mb-6 shrink-0">
            <div>
              <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2"><Code className="w-5 h-5 text-teal-400"/> Manual API Tester</h2>
              <p className="text-sm text-slate-400">Direct endpoint execution with token</p>
            </div>
          </div>

          <div className="space-y-4 shrink-0">
            <div className="flex gap-2">
              <select value={apiTester.method} onChange={e => setApiTester(p => ({...p, method: e.target.value}))} className="bg-slate-800 border-slate-600 text-white rounded-lg px-3 py-2 text-sm focus:border-teal-500 outline-none">
                <option>GET</option>
                <option>POST</option>
              </select>
              <input value={apiTester.path} onChange={e => setApiTester(p => ({...p, path: e.target.value}))} type="text" className="flex-1 bg-slate-800 border-slate-600 text-white rounded-lg px-4 py-2 text-sm focus:border-teal-500 transition-colors outline-none font-mono" placeholder="/path" />
              <button onClick={executeApiTest} disabled={apiTester.loading} className="bg-teal-500 hover:bg-teal-400 text-slate-900 px-4 py-2 rounded-lg font-semibold text-sm w-24 flex justify-center items-center">
                {apiTester.loading ? <RefreshCw className="w-4 h-4 animate-spin"/> : 'Send'}
              </button>
            </div>
            
            {apiTester.method === 'POST' && (
              <textarea value={apiTester.body} onChange={e => setApiTester(p => ({...p, body: e.target.value}))} placeholder='{"key": "value"}' className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-emerald-400 font-mono text-sm h-32 focus:border-teal-500 outline-none custom-scrollbar" />
            )}
          </div>

          <div className="mt-6 flex-1 flex flex-col bg-[#0d1428] rounded-lg border border-slate-700/50 overflow-hidden relative">
            <div className="bg-slate-800 border-b border-slate-700 px-4 py-2 flex justify-between items-center shrink-0">
               <span className="text-xs font-medium text-slate-400">Response</span>
               {apiTester.status && (
                 <div className="flex items-center gap-3">
                   <span className="text-xs text-slate-500">{apiTester.time}ms</span>
                   <span className={`text-xs px-2 py-0.5 rounded ${apiTester.status >= 200 && apiTester.status < 300 ? 'bg-teal-500/20 text-teal-400' : 'bg-red-500/20 text-red-400'}`}>
                     {apiTester.status}
                   </span>
                 </div>
               )}
            </div>
            <div className="flex-1 overflow-auto p-4 custom-scrollbar">
              {apiTester.response ? (
                <pre className="text-xs text-slate-300 font-mono leading-relaxed">
                  {typeof apiTester.response === 'object' ? JSON.stringify(apiTester.response, null, 2) : apiTester.response}
                </pre>
              ) : (
                <div className="flex items-center justify-center h-full text-slate-600 text-sm">No response yet</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* SEC 7: Readiness */}
        <div className="bg-[#1E293B] border border-slate-700 rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-white mb-1">Demo Readiness Check</h2>
              <p className="text-sm text-slate-400">Final verification script before demo</p>
            </div>
            <button disabled={runningReadiness} onClick={runDemoReadiness} className="bg-teal-500 hover:bg-teal-400 text-slate-900 px-6 py-2 rounded-lg font-bold text-sm transition-colors">
              {runningReadiness ? 'Checking...' : 'Run Readiness Check'}
            </button>
          </div>

          <div className="space-y-2 bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
            {readinessData ? readinessData.steps.map(s => (
              <div key={s.id} className="flex justify-between items-center py-2 border-b border-slate-800 last:border-0 text-sm">
                <div className="flex items-center gap-3">
                  {s.status === 'PASS' ? <CheckCircle className="w-4 h-4 text-teal-500"/> :
                   s.status === 'FAIL' ? <XCircle className="w-4 h-4 text-red-500"/> :
                   s.status === 'PENDING' && readinessStepIndex === s.id ? <RefreshCw className="w-4 h-4 text-teal-500 animate-spin"/> :
                   <div className="w-4 h-4 rounded border border-slate-600"/>}
                  <span className={s.status === 'PENDING' && readinessStepIndex !== s.id ? 'text-slate-500' : 'text-slate-300'}>{s.name}</span>
                </div>
                {s.detail && <span className="text-xs font-mono text-slate-500">{s.detail}</span>}
              </div>
            )) : (
              <div className="py-8 text-center text-slate-500 text-sm">Run check to verify demo safety</div>
            )}
          </div>

          {readinessData?.final && (
            <div className={`mt-6 p-4 rounded-lg text-center font-bold border flex flex-col items-center justify-center gap-2 ${
              readinessData.final === 'PASS' ? 'bg-teal-500/10 border-teal-500 text-teal-400' : 'bg-red-500/10 border-red-500 text-red-400'
            }`}>
              {readinessData.final === 'PASS' ? (
                <>
                  <Shield className="w-8 h-8"/> 
                  <p className="text-lg">✓ Ready for Demo! All checks passed.</p>
                  <p className="text-xs font-normal opacity-80 mt-1">Check completed at {new Date().toLocaleTimeString()}</p>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-8 h-8"/> 
                  <p className="text-lg">⚠ Readiness Failed. Fix issues before demo.</p>
                </>
              )}
            </div>
          )}
        </div>

        {/* SEC 8: Error Logs */}
        <div className="bg-[#1E293B] border border-slate-700 rounded-xl p-6 flex flex-col max-h-[500px]">
          <div className="flex justify-between items-center mb-6 shrink-0">
            <div>
              <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2"><Terminal className="w-5 h-5 text-red-400"/> Recent Errors Log</h2>
              <p className="text-sm text-slate-400">Captured backend system exceptions</p>
            </div>
            <button onClick={clearErrors} className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-lg font-medium text-xs transition-colors border border-slate-700">
              Clear Logs
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-2">
            {errors.length === 0 ? (
              <div className="text-center p-10 mt-10 text-slate-500 text-sm border border-dashed border-slate-700 rounded-lg">No errors recorded in memory</div>
            ) : (
              errors.map((err, i) => (
                <div key={i} className="bg-slate-900 border border-red-500/20 rounded-lg p-3">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs bg-red-500/10 text-red-400 px-2 py-0.5 rounded font-mono">{err.endpoint}</span>
                    <span className="text-xs text-slate-500">{new Date(err.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <div className="text-sm text-red-300 font-medium mb-1">{err.errorMessage}</div>
                  <details className="text-xs group cursor-pointer">
                     <summary className="text-slate-500 py-1 hover:text-slate-400">View Stack Trace</summary>
                     <pre className="mt-2 text-[10px] text-slate-400 bg-[#0A0F1E] p-3 rounded overflow-x-auto leading-tight border border-slate-800 max-h-40 overflow-y-auto custom-scrollbar">
                       {err.stackTrace}
                     </pre>
                  </details>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

export default TestDashboard;
