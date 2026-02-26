import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Maximize, Minimize } from 'lucide-react';
import pceLogo from '@/assets/pce-logo.jpg';
import cseLogo from '@/assets/cse-logo.jpg';
import archDiagram from '@/assets/arch-diagram.jpg';
import detectRight from '@/assets/detect-right.jpg';
import detectAhead from '@/assets/detect-ahead.jpg';
import detectLeft from '@/assets/detect-left.jpg';
import detectCrowd from '@/assets/detect-crowd.jpg';

// ── Slide layout wrapper ──────────────────────────────────
function SlideLayout({ children, footer = true, slideNum }: { children: React.ReactNode; footer?: boolean; slideNum?: number }) {
  return (
    <div className="w-[1920px] h-[1080px] bg-white relative flex flex-col overflow-hidden" style={{ fontFamily: "'Times New Roman', serif" }}>
      {/* Header logos */}
      <div className="flex items-start justify-between px-12 pt-6">
        <img src={pceLogo} alt="PCE" className="h-[100px] object-contain" />
        <img src={cseLogo} alt="CSE" className="h-[100px] object-contain" />
      </div>
      {/* Content */}
      <div className="flex-1 px-16 py-4 flex flex-col">
        {children}
      </div>
      {/* Footer */}
      {footer && (
        <div className="px-16 pb-4 flex items-center justify-between">
          <h3 className="text-[#003366] font-bold text-[22px] tracking-wide">
            WEARABLE NAVIGATION SYSTEM FOR THE VISUALLY IMPAIRED
          </h3>
          {slideNum && <span className="text-[#666] text-[20px]">{slideNum}</span>}
        </div>
      )}
    </div>
  );
}

function RedBanner({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#cc0000] text-white text-center py-3 text-[28px] font-bold tracking-wider -mx-16">
      {children}
    </div>
  );
}

function SlideTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-[#003366] font-bold text-[40px] mt-4 mb-4">{children}</h2>;
}

function SubTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-[#003366] font-bold text-[32px] mb-3">{children}</h3>;
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="text-[#333] text-[26px] leading-[1.8] mb-1 list-disc ml-8">
      {children}
    </li>
  );
}

// ── Slides ──────────────────────────────────────
function Slide1() {
  return (
    <SlideLayout footer={false}>
      <RedBanner>CSD 415 Project Phase - II</RedBanner>
      <div className="flex-1 flex flex-col items-center justify-center text-center -mt-8">
        <h1 className="text-[#003366] font-bold text-[52px] leading-tight mb-2">
          WEARABLE NAVIGATION SYSTEM FOR THE<br />VISUALLY IMPAIRED
        </h1>
        <p className="text-[#003366] text-[36px] font-semibold italic mb-12">Progress Review</p>
        <div className="flex w-full px-20 justify-between items-start">
          <div className="text-left text-[24px] text-[#003366]">
            <p>SUPERVISOR :</p>
            <p>Prof. Deepa Thomas</p>
            <p>Assistant Professor</p>
            <p>Dept. of CSE</p>
          </div>
          <div className="text-left text-[24px]">
            <p className="text-[#cc0000] font-semibold mb-1">Presented By,</p>
            <p className="text-[#cc0000] font-semibold mb-2">TEAM MEMBERS:</p>
            <table className="text-[#003366]">
              <tbody>
                <tr><td className="pr-12">AJAY C S</td><td>PRC22CS008</td></tr>
                <tr><td className="pr-12">ANDREW DANIEL</td><td>PRC22CS012</td></tr>
                <tr><td className="pr-12">JOBIL LUKE LIBU</td><td>PRC22CS026</td></tr>
                <tr><td className="pr-12">VISHNU T U</td><td>PRC22CS064</td></tr>
              </tbody>
            </table>
          </div>
        </div>
        <p className="text-[#cc0000] text-[22px] mt-8 self-start ml-20">Date: 17-12-2025</p>
      </div>
    </SlideLayout>
  );
}

function Slide2() {
  return (
    <SlideLayout slideNum={2}>
      <SlideTitle>Contents</SlideTitle>
      <ul className="mt-4 space-y-2">
        {['Introduction', 'Literature Review', 'Gaps Identified', 'Objectives', 'Proposed Methodology', 'Dataset', 'Implementation', 'Results And Discussion', 'Conclusion', 'References'].map(item => (
          <Bullet key={item}>{item}</Bullet>
        ))}
      </ul>
    </SlideLayout>
  );
}

function Slide3() {
  return (
    <SlideLayout slideNum={3}>
      <SlideTitle>INTRODUCTION</SlideTitle>
      <div className="text-[26px] text-[#333] leading-[2] mt-4 space-y-4">
        <p>Blind and Visually impaired people struggle to navigate safely. Cane sticks provide no information of the surrounding area. Risk of tripping, bumping into pedestrians, stepping into potholes, colliding with animals etc.</p>
        <p>Currently existing portable navigation/obstacle detection technologies are very basic.</p>
        <p>This project aims to improve detection accuracy and user comfort.</p>
        <p>Features context-aware obstacle prioritization, GPS enabled navigation, real-time audio, environmental condition alerts.</p>
      </div>
    </SlideLayout>
  );
}

function LitSurveySlide({ title, data, slideNum }: { title: string; data: { title: string; author: string; method: string; advantages: string; disadvantages: string }; slideNum: number }) {
  return (
    <SlideLayout slideNum={slideNum}>
      <SlideTitle>{title}</SlideTitle>
      <div className="mt-2 overflow-auto">
        <table className="w-full border-collapse text-[20px] text-[#333]">
          <thead>
            <tr className="bg-[#003366] text-white">
              <th className="border border-[#999] p-3 text-left w-[22%]">Title</th>
              <th className="border border-[#999] p-3 text-left w-[15%]">Author &amp; Year</th>
              <th className="border border-[#999] p-3 text-left w-[25%]">Methodology</th>
              <th className="border border-[#999] p-3 text-left w-[19%]">Advantages</th>
              <th className="border border-[#999] p-3 text-left w-[19%]">Disadvantages</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-[#999] p-3">{data.title}</td>
              <td className="border border-[#999] p-3">{data.author}</td>
              <td className="border border-[#999] p-3">{data.method}</td>
              <td className="border border-[#999] p-3">{data.advantages}</td>
              <td className="border border-[#999] p-3">{data.disadvantages}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </SlideLayout>
  );
}

function Slide9() {
  return (
    <SlideLayout slideNum={9}>
      <SlideTitle>Gaps Identified</SlideTitle>
      <ul className="mt-6 space-y-6">
        <Bullet>Existing systems rely mainly on cane sticks or single-sensor solutions.</Bullet>
        <Bullet>Most systems have incomplete coverage and fail to detect obstacles at all levels (head, mid-body, ground).</Bullet>
        <Bullet>Poor depth perception and difficulty in detecting stairs, slopes, and uneven surfaces, leading to unsafe navigation.</Bullet>
      </ul>
    </SlideLayout>
  );
}

function Slide10() {
  return (
    <SlideLayout slideNum={10}>
      <SlideTitle>PROBLEM STATEMENT &amp; OBJECTIVES</SlideTitle>
      <p className="text-[26px] text-[#333] leading-[1.8] mb-6">
        Blind people have to rely on walking canes which do not provide sufficient information of their surroundings.
      </p>
      <SubTitle>OBJECTIVES</SubTitle>
      <ul className="space-y-3">
        <Bullet>Develop a portable navigation device.</Bullet>
        <Bullet>To design a wearable assistive navigation system that employs deep learning techniques for accurate obstacle detection and real-time audio guidance to visually impaired users.</Bullet>
        <Bullet>It should provide immediate audio feedback through headphones, informing the user about the type and direction of obstacles for safe navigation.</Bullet>
      </ul>
    </SlideLayout>
  );
}

function Slide11() {
  return (
    <SlideLayout slideNum={11}>
      <SlideTitle>PROPOSED METHODOLOGY</SlideTitle>
      <SubTitle>Architecture</SubTitle>
      <div className="flex-1 flex items-center justify-center">
        <img src={archDiagram} alt="Architecture Diagram" className="max-h-[550px] object-contain border border-[#ccc] rounded" />
      </div>
      <p className="text-center text-[22px] text-[#666] mt-2">Fig.1: Architecture Diagram</p>
    </SlideLayout>
  );
}

function Slide12() {
  return (
    <SlideLayout slideNum={12}>
      <SlideTitle>PROPOSED METHODOLOGY (Cont.)</SlideTitle>
      <SubTitle>Hardware Requirements</SubTitle>
      <ul className="space-y-2">
        <Bullet>Raspberry Pi 4 (4GB)</Bullet>
        <Bullet>Pi Camera / USB Camera</Bullet>
        <Bullet>Mini-LiDAR (TF-Mini)</Bullet>
        <Bullet>Ultrasonic sensors - HC SR04 (×3)</Bullet>
        <Bullet>Headset for Audio feedbacks</Bullet>
        <Bullet>Power bank (10,000–20,000 mAh)</Bullet>
        <Bullet>ESP 32 WROOM</Bullet>
        <Bullet>Resistors: 1k Ohm(3x), 2k Ohm(3x)</Bullet>
      </ul>
    </SlideLayout>
  );
}

function Slide13() {
  return (
    <SlideLayout slideNum={13}>
      <SlideTitle>PROPOSED METHODOLOGY (Cont.)</SlideTitle>
      <SubTitle>Software Requirements</SubTitle>
      <ul className="space-y-3">
        <Bullet>Operating System: Windows 10 / Linux</Bullet>
        <Bullet>Programming Language: Python</Bullet>
        <Bullet>Libraries &amp; Frameworks: ultralytics(YOLOv8), opencv-python, pyttsx3, numpy</Bullet>
        <Bullet>Development Environment: VS Code</Bullet>
      </ul>
    </SlideLayout>
  );
}

function Slide14() {
  return (
    <SlideLayout slideNum={14}>
      <SlideTitle>DATASET</SlideTitle>
      <div className="space-y-6 mt-4">
        <div>
          <SubTitle>1. COCO Dataset (Common Objects In Context)</SubTitle>
          <ul><Bullet>Purpose: Detection of humans and vehicles</Bullet><Bullet>Model Used: YOLOv8-Nano</Bullet></ul>
        </div>
        <div>
          <SubTitle>2. Door Detection Dataset</SubTitle>
          <ul><Bullet>Purpose: Detection of doors for indoor navigation</Bullet><Bullet>Model Used: YOLOv8-Nano</Bullet></ul>
        </div>
        <div>
          <SubTitle>3. Staircase Detection Dataset</SubTitle>
          <ul><Bullet>Purpose: Detection of staircase for safety</Bullet><Bullet>Model Used: YOLOv8-Nano</Bullet></ul>
        </div>
      </div>
    </SlideLayout>
  );
}

function Slide15() {
  return (
    <SlideLayout slideNum={15}>
      <SlideTitle>Implementation / Work Done So Far</SlideTitle>
      <ul className="space-y-3 mt-4">
        <Bullet><strong>Model Loading:</strong> YOLOv8-nano weights (yolov8n.pt) were used for fast detection.</Bullet>
        <Bullet><strong>Webcam Input:</strong> A live video stream was captured at 5 FPS to ensure both responsiveness and computational efficiency.</Bullet>
        <Bullet><strong>Detection Logic:</strong> Persons were detected and assigned a direction (left, right, ahead) based on their position in the frame. If more than 3 persons were detected simultaneously, the system classified the situation as a crowd. Vehicles were given priority in detection announcements to ensure safety.</Bullet>
        <Bullet><strong>Audio Output:</strong> Using the pyttsx3 library, the system produced real-time voice feedback every 4 seconds, ensuring periodic and non-overlapping alerts.</Bullet>
      </ul>
    </SlideLayout>
  );
}

function Slide16() {
  return (
    <SlideLayout slideNum={16}>
      <SlideTitle>Implementation / Work Done So Far (Cont.)</SlideTitle>
      <ul className="space-y-4 mt-4">
        <Bullet><strong>Result Processing:</strong> The system analyzed the most recent frame at 4-second intervals for reliable audio announcements, while still displaying detections visually in real time.</Bullet>
        <Bullet><strong>Hardware Components:</strong> The components purchased for the project include an ESP32 WROOM, an ultrasonic sensor, jumper wires, and resistors.</Bullet>
      </ul>
    </SlideLayout>
  );
}

function Slide17() {
  return (
    <SlideLayout slideNum={17}>
      <SlideTitle>Results and Discussion</SlideTitle>
      <SubTitle>Person and Vehicle Detection</SubTitle>
      <div className="flex items-center justify-center gap-8 mt-6 flex-1">
        <div className="text-center">
          <img src={detectRight} alt="Person on right" className="h-[380px] object-contain border border-[#ccc] rounded" />
          <p className="text-[20px] text-[#666] mt-2">Fig.2: Person on right (0.95)</p>
        </div>
        <div className="text-center">
          <img src={detectAhead} alt="Person ahead" className="h-[380px] object-contain border border-[#ccc] rounded" />
          <p className="text-[20px] text-[#666] mt-2">Fig.3: Person ahead (0.91)</p>
        </div>
        <div className="text-center">
          <img src={detectLeft} alt="Person on left" className="h-[380px] object-contain border border-[#ccc] rounded" />
          <p className="text-[20px] text-[#666] mt-2">Fig.4: Person on left (0.95)</p>
        </div>
      </div>
    </SlideLayout>
  );
}

function Slide18() {
  return (
    <SlideLayout slideNum={18}>
      <SlideTitle>Results and Discussion (Cont.)</SlideTitle>
      <SubTitle>Crowd Detection</SubTitle>
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <img src={detectCrowd} alt="Crowd detection" className="max-h-[500px] object-contain border border-[#ccc] rounded" />
          <p className="text-[20px] text-[#666] mt-2">Fig.5: Model detected multiple persons – "Crowd Ahead"</p>
        </div>
      </div>
    </SlideLayout>
  );
}

function Slide19() {
  return (
    <SlideLayout slideNum={19}>
      <SlideTitle>Results and Discussion (Cont.)</SlideTitle>
      <SubTitle>Result:</SubTitle>
      <ul className="space-y-3 mt-2">
        <Bullet>Real-time detection of persons and vehicles achieved at ~5 FPS on a standard laptop.</Bullet>
        <Bullet>The YOLOv8-Nano deep learning model achieved high detection accuracy for persons and vehicles.</Bullet>
        <Bullet>Audio alerts generated with directional cues (left, right, ahead).</Bullet>
        <Bullet>Crowd detection triggered when more than four persons are present.</Bullet>
        <Bullet>Vehicle detection prioritized in audio output for safety-critical scenarios.</Bullet>
        <Bullet>Lightweight model (YOLOv8-nano) demonstrated practical and responsive performance.</Bullet>
      </ul>
    </SlideLayout>
  );
}

function Slide20() {
  return (
    <SlideLayout slideNum={20}>
      <SlideTitle>Results and Discussion (Cont.)</SlideTitle>
      <SubTitle>Discussion (Work for S8):</SubTitle>
      <ul className="space-y-3 mt-4">
        <Bullet>Deploy the model on Raspberry Pi.</Bullet>
        <Bullet>Integrate multi-sensor fusion (Lidar, ultrasonic sensors).</Bullet>
        <Bullet>Improve staircase detection accuracy.</Bullet>
        <Bullet>Develop custom wearable device.</Bullet>
        <Bullet>Enhance audio feedback system.</Bullet>
        <Bullet>Expand object categories.</Bullet>
      </ul>
    </SlideLayout>
  );
}

function Slide21() {
  return (
    <SlideLayout slideNum={21}>
      <SlideTitle>CONCLUSION</SlideTitle>
      <ul className="space-y-4 mt-6">
        <Bullet>Achieves real-time person and vehicle detection with audio-based guidance.</Bullet>
        <Bullet>Optimized for assistive navigation using lightweight YOLOv8-nano.</Bullet>
        <Bullet>Future enhancements include portable hardware deployment.</Bullet>
        <Bullet>Plans to add distance estimation and external sensor support.</Bullet>
      </ul>
    </SlideLayout>
  );
}

function Slide22() {
  return (
    <SlideLayout slideNum={22}>
      <SlideTitle>REFERENCES</SlideTitle>
      <div className="text-[22px] text-[#333] leading-[2] mt-4 space-y-3">
        <p>[1] Bouteraa, Y. (2023). Smart real time wearable navigation support system for BVIP. <em>Alexandria Engineering Journal</em>, 62, 223-235.</p>
        <p>[2] Li, Z., Han, F., & Zheng, K. (2025). An RGB-D Camera-Based Wearable Device for Visually Impaired People. <em>Electronics</em>, 14(11), 2168.</p>
        <p>[3] Gharghan, S. K., et al. (2024). Smart stick navigation system for visually impaired based on ML. <em>Journal of Sensor and Actuator Networks</em>, 13(4), 43.</p>
        <p>[4] Xu, J., et al. (2025). Multimodal Navigation and Virtual Companion System. <em>Sensors</em>, 25(13), 4223.</p>
        <p>[5] Okolo, G. I., et al. (2025). Smart assistive navigation system for visually impaired people. <em>Journal of Disability Research</em>, 4(1), 20240086.</p>
      </div>
    </SlideLayout>
  );
}

function Slide23() {
  return (
    <SlideLayout footer={false}>
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-[#003366] font-bold text-[80px] mb-8">Thank You</h1>
          <h3 className="text-[#003366] font-bold text-[28px] tracking-wide">
            WEARABLE NAVIGATION SYSTEM FOR THE VISUALLY IMPAIRED
          </h3>
        </div>
      </div>
    </SlideLayout>
  );
}

// Literature survey data
const litSurveys = [
  { title: 'LITERATURE SURVEY SUMMARY', author: 'Bouteraa et al., 2023', paperTitle: 'Smart real time wearable navigation support system for BVIP', method: 'Raspberry Pi 4 + Arduino Due, Ultrasonic & LiDAR sensors, 3D-printed glass & hand band', advantages: 'Accurate obstacle detection, Haptic + voice alerts, Faster & fewer collisions', disadvantages: 'Misses tiny ground objects, ~5h battery, Higher cost, No GPS routing' },
  { title: 'LITERATURE SURVEY SUMMARY (Cont.)', author: 'Li et al., 2025', paperTitle: 'RGB-D Camera-Based Wearable Device for Visually Impaired People', method: 'Arm-mounted device with RGB-D camera & IMU, YOLOv8n for object recognition, Vibration & audio feedback', advantages: 'Detects ground & mid-air obstacles, Reduces stigma, Lightweight, High accuracy', disadvantages: 'Tested on blindfolded users only, Indoor tests, Limited obstacle types, Expensive' },
  { title: 'LITERATURE SURVEY SUMMARY (Cont.)', author: 'Gharghan et al., 2024', paperTitle: 'Smart stick navigation system for visually impaired based on ML', method: 'Arduino Nano with ultrasonic, moisture, heart rate sensors, GPS & GSM, ML algorithms (AdaBoost, Random Forest, etc.)', advantages: 'Improves independence & safety, Health monitoring, Emergency alerts, 99.9% accuracy', disadvantages: 'Battery limitations, GPS ineffective indoors, Limited testing, More costly' },
  { title: 'LITERATURE SURVEY SUMMARY (Cont.)', author: 'Xu et al., 2025', paperTitle: 'Multimodal Navigation and Virtual Companion System', method: 'Wearable helmet with dual cameras + ultrasonic radar, ESP32 via Bluetooth, Tactile + auditory feedback, Mobile app + cloud server', advantages: 'Safe reliable navigation, Hands-free operation, Minimal interference with hearing', disadvantages: 'System latency ~1-1.5s, Needs lightweighting, Not industrialized, High bandwidth' },
  { title: 'LITERATURE SURVEY SUMMARY (Cont.)', author: 'Okolo et al., 2024', paperTitle: 'Smart Assistive Navigation System for Visually Impaired People', method: 'Raspberry Pi 3, YOLOv8 detection, Ultrasonic & moisture sensors, Camera + gyro, Smartphone app', advantages: '>90% accuracy, Real-time detection, Detects wet surfaces, Audio + vibration, Portable', disadvantages: 'Misses stairs/holes, Delay for large objects, High cost, Affected by weather, Needs continuous power' },
];

// ── Main Presentation Component ──────────────────────────────────────
export default function Presentation() {
  const [current, setCurrent] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const slides = [
    <Slide1 key={0} />,
    <Slide2 key={1} />,
    <Slide3 key={2} />,
    ...litSurveys.map((s, i) => (
      <LitSurveySlide key={3 + i} title={s.title} slideNum={4 + i} data={{ title: s.paperTitle, author: s.author, method: s.method, advantages: s.advantages, disadvantages: s.disadvantages }} />
    )),
    <Slide9 key={8} />,
    <Slide10 key={9} />,
    <Slide11 key={10} />,
    <Slide12 key={11} />,
    <Slide13 key={12} />,
    <Slide14 key={13} />,
    <Slide15 key={14} />,
    <Slide16 key={15} />,
    <Slide17 key={16} />,
    <Slide18 key={17} />,
    <Slide19 key={18} />,
    <Slide20 key={19} />,
    <Slide21 key={20} />,
    <Slide22 key={21} />,
    <Slide23 key={22} />,
  ];

  const total = slides.length;
  const [scale, setScale] = useState(1);

  const goNext = useCallback(() => setCurrent(c => Math.min(c + 1, total - 1)), [total]);
  const goPrev = useCallback(() => setCurrent(c => Math.max(c - 1, 0)), []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  useEffect(() => {
    const updateScale = () => {
      setScale(Math.min(window.innerWidth / 1920, (window.innerHeight - 60) / 1080));
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); goNext(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); goPrev(); }
      if (e.key === 'f' || e.key === 'F5') { e.preventDefault(); toggleFullscreen(); }
      if (e.key === 'Escape') setIsFullscreen(false);
    };
    window.addEventListener('keydown', handler);
    const fsHandler = () => { if (!document.fullscreenElement) setIsFullscreen(false); };
    document.addEventListener('fullscreenchange', fsHandler);
    return () => { window.removeEventListener('keydown', handler); document.removeEventListener('fullscreenchange', fsHandler); };
  }, [goNext, goPrev, toggleFullscreen]);

  return (
    <div className="min-h-screen bg-[#1a1a2e] flex flex-col items-center justify-center select-none" onClick={goNext}>
      {/* Scaled slide */}
      <div className="relative w-full flex-1 flex items-center justify-center overflow-hidden">
        <div
          className="origin-center"
          style={{ width: 1920, height: 1080, transform: `scale(${scale})` }}
        >
          {slides[current]}
        </div>
      </div>

      {/* Controls bar */}
      <div
        className="w-full h-[60px] bg-[#0f0f23] flex items-center justify-center gap-6 text-white z-50"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={goPrev} disabled={current === 0} className="p-2 hover:bg-white/10 rounded disabled:opacity-30 transition">
          <ChevronLeft size={24} />
        </button>
        <span className="text-[16px] font-mono min-w-[80px] text-center">
          {current + 1} / {total}
        </span>
        <button onClick={goNext} disabled={current === total - 1} className="p-2 hover:bg-white/10 rounded disabled:opacity-30 transition">
          <ChevronRight size={24} />
        </button>
        <button onClick={toggleFullscreen} className="p-2 hover:bg-white/10 rounded transition ml-4">
          {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
        </button>
      </div>
    </div>
  );
}
