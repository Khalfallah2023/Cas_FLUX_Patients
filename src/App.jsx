import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Move, Maximize2, Info, Clock, User, Activity, Route } from 'lucide-react';

// Données du patient 185 (séjour le plus long)
const patientData = {
  patient_id: "185",
  entry_time: "12/11/2015 14:02:34",
  exit_time: "12/11/2015 19:54:46",
  total_duration_minutes: 352.19,
  nodes: [
    {id: 1, label: "Entrée des Consultations", timestamp_start: "12/11/2015 14:02:34", room: "entry"},
    {id: 2, label: "ACCUEIL.S_Attente_Accueil(1)", timestamp_start: "12/11/2015 14:04:49", timestamp_end: "12/11/2015 14:05:35", duration_minutes: 0.78, room: "accueil_waiting"},
    {id: 3, label: "ACCUEIL.Bureau_AccueilPRIO(1)", timestamp_start: "12/11/2015 14:05:46", timestamp_end: "12/11/2015 14:08:53", duration_minutes: 3.11, room: "accueil_desk", staff: "ACCUEIL.Agent_Acc_1(3)"},
    {id: 4, label: "URO.S_Attente_5(1)", timestamp_start: "12/11/2015 14:10:29", timestamp_end: "12/11/2015 14:11:12", duration_minutes: 0.73, room: "waiting_room"},
    {id: 5, label: "URO.Box_Consult(5)", timestamp_start: "12/11/2015 14:11:29", timestamp_end: "12/11/2015 14:18:20", duration_minutes: 6.85, room: "consult_5", staff: "URO.AS(2) - URO.MED(6)"},
    {id: 6, label: "URO.S_Attente_5(1)", timestamp_start: "12/11/2015 14:18:37", timestamp_end: "12/11/2015 14:19:11", duration_minutes: 0.56, room: "waiting_room"},
    {id: 7, label: "URO.Salle_Débitmétrie(1)", timestamp_start: "12/11/2015 14:19:31", timestamp_end: "12/11/2015 14:21:30", duration_minutes: 1.98, room: "flowmetry", staff: "URO.AS(1)"},
    {id: 8, label: "URO.S_Attente_5(1)", timestamp_start: "12/11/2015 14:21:50", timestamp_end: "12/11/2015 14:22:13", duration_minutes: 0.39, room: "waiting_room"},
    {id: 9, label: "URO.Box_Consult(2)", timestamp_start: "12/11/2015 14:22:44", timestamp_end: "12/11/2015 14:38:09", duration_minutes: 15.42, room: "consult_2", staff: "URO.MED(6)"},
    {id: 10, label: "URO.S_Attente_5(1)", timestamp_start: "12/11/2015 14:38:39", timestamp_end: "12/11/2015 15:39:43", duration_minutes: 61.06, room: "waiting_room"},
    {id: 11, label: "URO.Salle_Examen(2)", timestamp_start: "12/11/2015 15:40:14", timestamp_end: "12/11/2015 16:52:31", duration_minutes: 72.29, room: "exam_2", staff: "URO.AS(2) - URO.IDE(1) - URO.MED(6)"},
    {id: 12, label: "URO.S_Attente_5(1)", timestamp_start: "12/11/2015 16:53:02", timestamp_end: "12/11/2015 17:48:11", duration_minutes: 55.15, room: "waiting_room"},
    {id: 13, label: "URO.Salle_Examen(3)", timestamp_start: "12/11/2015 17:48:42", timestamp_end: "12/11/2015 17:59:46", duration_minutes: 11.06, room: "exam_3", staff: "URO.IDE(1)"},
    {id: 14, label: "URO.S_Attente_5(1)", timestamp_start: "12/11/2015 18:00:17", timestamp_end: "12/11/2015 19:00:13", duration_minutes: 59.93, room: "waiting_room"},
    {id: 15, label: "URO.Bureau_Annonce(1)", timestamp_start: "12/11/2015 19:00:43", timestamp_end: "12/11/2015 19:46:50", duration_minutes: 46.12, room: "notification_room", staff: "URO.IDE_Annonce(1)"},
    {id: 16, label: "SORTIE_URO.File_Attente(1)", timestamp_start: "12/11/2015 19:48:16", timestamp_end: "12/11/2015 19:48:36", duration_minutes: 0.34, room: "exit_queue"},
    {id: 17, label: "SORTIE_URO.Bureau_Sortie(1)", timestamp_start: "12/11/2015 19:48:42", timestamp_end: "12/11/2015 19:54:46", duration_minutes: 6.06, room: "exit_desk", staff: "SORTIE_URO.Agent_Sortie(1)"},
    {id: 18, label: "Sortie des Consultations", timestamp_start: "12/11/2015 19:56:49", room: "exit"}
  ]
};

// Q4: Plan architectural basé sur le plan réel fourni
// Échelle: 1px = 5cm (largeur box consultation = 70px = 3.50m)
// Positions mesurées sur le plan réel
const roomLayout = {
  // Entrée (bas gauche du plan)
  entry: { x: 50, y: 750, width: 60, height: 50, label: "ENTRÉE", color: "#10b981" },
  
  // Zone accueil (gauche, près de l'entrée)
  accueil_waiting: { x: 50, y: 650, width: 80, height: 60, label: "Attente Accueil", color: "#fbbf24" },
  accueil_desk: { x: 50, y: 570, width: 70, height: 50, label: "Bureau Accueil", color: "#3b82f6" },
  
  // Zone notification et nursing (gauche, milieu)
  notification_room: { x: 120, y: 380, width: 90, height: 70, label: "Bureau Annonce", color: "#8b5cf6" },
  nursing_room: { x: 50, y: 380, width: 60, height: 70, label: "Bureau Infirmière", color: "#8b5cf6" },
  
  // Salle d'attente URO (centre, en rose sur le plan)
  waiting_room: { x: 380, y: 380, width: 140, height: 120, label: "Salle d'Attente URO", color: "#fbbf24" },
  
  // Salles de consultation (rangée du bas, boxes jaunes)
  consult_1: { x: 100, y: 680, width: 70, height: 70, label: "Consult #1", color: "#fcd34d" },
  consult_2: { x: 190, y: 680, width: 70, height: 70, label: "Consult #2", color: "#fcd34d" },
  consult_3: { x: 280, y: 680, width: 70, height: 70, label: "Consult #3", color: "#fcd34d" },
  consult_4: { x: 370, y: 680, width: 70, height: 70, label: "Consult #4", color: "#fcd34d" },
  consult_5: { x: 460, y: 680, width: 70, height: 70, label: "Consult #5", color: "#fcd34d" },
  consult_6: { x: 550, y: 680, width: 70, height: 70, label: "Consult #6", color: "#fcd34d" },
  consult_7: { x: 640, y: 680, width: 70, height: 70, label: "Consult #7", color: "#fcd34d" },
  
  // Salle de débitmétrie (flowmetry) - droite, zone verte
  flowmetry: { x: 740, y: 520, width: 70, height: 70, label: "Débitmétrie", color: "#86efac" },
  
  // Salles d'examen (rangée du haut, en bleu)
  exam_1: { x: 280, y: 150, width: 80, height: 80, label: "Exam #1", color: "#93c5fd" },
  exam_2: { x: 380, y: 150, width: 80, height: 80, label: "Exam #2", color: "#93c5fd" },
  exam_3: { x: 640, y: 150, width: 100, height: 80, label: "Exam #3", color: "#93c5fd" },
  
  // Zone de sortie (haut centre)
  exit_queue: { x: 480, y: 80, width: 60, height: 40, label: "File Sortie", color: "#fbbf24" },
  exit_desk: { x: 480, y: 20, width: 70, height: 50, label: "Bureau Sortie", color: "#3b82f6" },
  exit: { x: 480, y: -50, width: 70, height: 50, label: "SORTIE", color: "#ef4444" }
};

const PatientFlowVisualization = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [viewMode, setViewMode] = useState('architectural');
  const [showGrid, setShowGrid] = useState(true);
  const [draggedNode, setDraggedNode] = useState(null);
  const [nodePositions, setNodePositions] = useState({});
  const [zoom, setZoom] = useState(0.75);
  const [pan, setPan] = useState({ x: 50, y: 100 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const canvasRef = useRef(null);

  // Q4: Calculer les points de référence (centres des salles)
  const referencePoints = {};
  Object.entries(roomLayout).forEach(([key, room]) => {
    referencePoints[key] = {
      x: room.x + room.width / 2,
      y: room.y + room.height / 2
    };
  });

  // Q5: Réseau de couloirs (lignes médianes) basé sur le plan réel
  const corridorNetwork = [
    // Couloir vertical entrée -> accueil
    { x1: 80, y1: 750, x2: 80, y2: 600 },
    
    // Couloir horizontal zone accueil -> notification
    { x1: 80, y1: 550, x2: 165, y2: 550 },
    { x1: 165, y1: 550, x2: 165, y2: 415 },
    
    // Couloir principal horizontal (traverse tout le service)
    { x1: 80, y1: 550, x2: 800, y2: 550 },
    
    // Connexions verticales vers salles de consultation
    { x1: 135, y1: 550, x2: 135, y2: 715 },
    { x1: 225, y1: 550, x2: 225, y2: 715 },
    { x1: 315, y1: 550, x2: 315, y2: 715 },
    { x1: 405, y1: 550, x2: 405, y2: 715 },
    { x1: 495, y1: 550, x2: 495, y2: 715 },
    { x1: 585, y1: 550, x2: 585, y2: 715 },
    { x1: 675, y1: 550, x2: 675, y2: 715 },
    
    // Connexion vers salle d'attente
    { x1: 450, y1: 550, x2: 450, y2: 440 },
    
    // Connexion vers flowmetry
    { x1: 775, y1: 550, x2: 775, y2: 555 },
    
    // Couloir horizontal zone examens
    { x1: 320, y1: 300, x2: 690, y2: 300 },
    
    // Connexions verticales couloir principal -> couloir examens
    { x1: 320, y1: 300, x2: 320, y2: 550 },
    { x1: 420, y1: 300, x2: 420, y2: 550 },
    { x1: 690, y1: 300, x2: 690, y2: 550 },
    
    // Connexions vers salles d'examen
    { x1: 320, y1: 300, x2: 320, y2: 190 },
    { x1: 420, y1: 300, x2: 420, y2: 190 },
    { x1: 690, y1: 300, x2: 690, y2: 190 },
    
    // Couloir vers sortie
    { x1: 515, y1: 190, x2: 515, y2: 120 },
    { x1: 515, y1: 120, x2: 515, y2: 35 },
    { x1: 515, y1: 35, x2: 515, y2: -25 }
  ];

  // Initialiser les positions des nœuds
  useEffect(() => {
    const initialPositions = {};
    patientData.nodes.forEach(node => {
      if (referencePoints[node.room]) {
        initialPositions[node.id] = { ...referencePoints[node.room] };
      }
    });
    setNodePositions(initialPositions);
  }, []);

  // Animation automatique
  useEffect(() => {
    if (isPlaying && currentStep < patientData.nodes.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 1500);
      return () => clearTimeout(timer);
    } else if (currentStep >= patientData.nodes.length - 1) {
      setIsPlaying(false);
    }
  }, [isPlaying, currentStep]);

  // Q5: Algorithme de pathfinding sur le maillage des couloirs
  const findPathOnGrid = (from, to) => {
    const path = [];
    const mainCorridorY = 550; // Couloir principal horizontal
    const examCorridorY = 300; // Couloir zone examens
    
    path.push({ x: from.x, y: from.y });
    
    // Aller au couloir le plus proche
    if (Math.abs(from.y - mainCorridorY) < Math.abs(from.y - examCorridorY)) {
      // Aller au couloir principal
      if (from.y !== mainCorridorY) {
        path.push({ x: from.x, y: mainCorridorY });
      }
    } else {
      // Aller au couloir des examens puis au couloir principal
      if (from.y !== examCorridorY) {
        path.push({ x: from.x, y: examCorridorY });
      }
      if (from.y < mainCorridorY) {
        path.push({ x: from.x, y: mainCorridorY });
      }
    }
    
    const currentX = path[path.length - 1].x;
    const currentY = path[path.length - 1].y;
    
    // Déterminer le couloir cible pour la destination
    let targetCorridorY = mainCorridorY;
    if (to.y < 350) {
      targetCorridorY = examCorridorY;
    }
    
    // Se déplacer horizontalement sur le couloir
    if (currentY === mainCorridorY && targetCorridorY === examCorridorY) {
      // Besoin de monter au couloir des examens
      // Trouver le point de connexion vertical le plus proche
      const verticalConnections = [320, 420, 690];
      const closestConnection = verticalConnections.reduce((prev, curr) => 
        Math.abs(curr - to.x) < Math.abs(prev - to.x) ? curr : prev
      );
      
      if (currentX !== closestConnection) {
        path.push({ x: closestConnection, y: mainCorridorY });
      }
      path.push({ x: closestConnection, y: examCorridorY });
      
      if (closestConnection !== to.x) {
        path.push({ x: to.x, y: examCorridorY });
      }
    } else if (currentX !== to.x && currentY === targetCorridorY) {
      path.push({ x: to.x, y: targetCorridorY });
    }
    
    // Aller à la destination finale
    if (to.y !== path[path.length - 1].y) {
      path.push({ x: to.x, y: to.y });
    }
    
    // S'assurer que le dernier point est la destination
    if (path[path.length - 1].x !== to.x || path[path.length - 1].y !== to.y) {
      path.push({ x: to.x, y: to.y });
    }
    
    return path;
  };

  // Q5: Calculer la distance totale parcourue
  const calculateTotalDistance = () => {
    let totalPixels = 0;
    for (let i = 0; i < patientData.nodes.length - 1; i++) {
      const fromPos = nodePositions[patientData.nodes[i].id];
      const toPos = nodePositions[patientData.nodes[i + 1].id];
      
      if (fromPos && toPos) {
        if (viewMode === 'path') {
          const path = findPathOnGrid(fromPos, toPos);
          for (let j = 0; j < path.length - 1; j++) {
            const dx = path[j + 1].x - path[j].x;
            const dy = path[j + 1].y - path[j].y;
            totalPixels += Math.sqrt(dx * dx + dy * dy);
          }
        } else {
          const dx = toPos.x - fromPos.x;
          const dy = toPos.y - fromPos.y;
          totalPixels += Math.sqrt(dx * dx + dy * dy);
        }
      }
    }
    // Échelle: 1 pixel = 0.05 mètre = 5cm
    return (totalPixels * 0.05).toFixed(2);
  };

  // Rendu du canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(pan.x, pan.y);
    ctx.scale(zoom, zoom);

    // Fond
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(-pan.x / zoom, -pan.y / zoom, canvas.width / zoom, canvas.height / zoom);

    // Grille
    if (showGrid) {
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 0.5 / zoom;
      const gridSize = 50;
      const startX = Math.floor(-pan.x / zoom / gridSize) * gridSize;
      const startY = Math.floor(-pan.y / zoom / gridSize) * gridSize;
      for (let x = startX; x < startX + 1200; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, startY);
        ctx.lineTo(x, startY + 1000);
        ctx.stroke();
      }
      for (let y = startY; y < startY + 1000; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(startX, y);
        ctx.lineTo(startX + 1200, y);
        ctx.stroke();
      }
    }

    // Q4 & Q5: Dessiner le plan architectural
    if (viewMode !== 'graph') {
      // Q5: Dessiner le réseau de couloirs en mode maillage
      if (viewMode === 'path') {
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 3 / zoom;
        ctx.setLineDash([8 / zoom, 4 / zoom]);
        corridorNetwork.forEach(corridor => {
          ctx.beginPath();
          ctx.moveTo(corridor.x1, corridor.y1);
          ctx.lineTo(corridor.x2, corridor.y2);
          ctx.stroke();
        });
        ctx.setLineDash([]);
      }

      // Dessiner les salles
      Object.entries(roomLayout).forEach(([key, room]) => {
        ctx.fillStyle = room.color + '40';
        ctx.strokeStyle = room.color;
        ctx.lineWidth = 2 / zoom;
        ctx.fillRect(room.x, room.y, room.width, room.height);
        ctx.strokeRect(room.x, room.y, room.width, room.height);
        
        // Label
        ctx.fillStyle = '#1e293b';
        ctx.font = `bold ${9 / zoom}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const lines = room.label.split(' ');
        const lineHeight = 11 / zoom;
        const totalHeight = lines.length * lineHeight;
        lines.forEach((line, idx) => {
          const yPos = room.y + room.height / 2 - totalHeight / 2 + idx * lineHeight + lineHeight / 2;
          ctx.fillText(line, room.x + room.width / 2, yPos);
        });
        
        // Q4: Point de référence (centre)
        if (viewMode === 'architectural' || viewMode === 'path') {
          ctx.fillStyle = '#475569';
          ctx.beginPath();
          ctx.arc(referencePoints[key].x, referencePoints[key].y, 3 / zoom, 0, Math.PI * 2);
          ctx.fill();
        }
      });
    }

    // Dessiner les chemins entre nœuds
    for (let i = 0; i < currentStep; i++) {
      const fromPos = nodePositions[patientData.nodes[i].id];
      const toPos = nodePositions[patientData.nodes[i + 1].id];

      if (fromPos && toPos) {
        const isActive = i === currentStep - 1;
        
        if (viewMode === 'path') {
          // Q5: Chemin sur le maillage
          const path = findPathOnGrid(fromPos, toPos);
          ctx.strokeStyle = isActive ? '#3b82f6' : '#93c5fd';
          ctx.lineWidth = (isActive ? 5 : 3) / zoom;
          ctx.beginPath();
          ctx.moveTo(path[0].x, path[0].y);
          for (let j = 1; j < path.length; j++) {
            ctx.lineTo(path[j].x, path[j].y);
          }
          ctx.stroke();
          
          // Flèche
          if (path.length > 1) {
            const last = path.length - 1;
            const angle = Math.atan2(path[last].y - path[last - 1].y, path[last].x - path[last - 1].x);
            const headlen = 15 / zoom;
            ctx.beginPath();
            ctx.moveTo(path[last].x, path[last].y);
            ctx.lineTo(
              path[last].x - headlen * Math.cos(angle - Math.PI / 6),
              path[last].y - headlen * Math.sin(angle - Math.PI / 6)
            );
            ctx.moveTo(path[last].x, path[last].y);
            ctx.lineTo(
              path[last].x - headlen * Math.cos(angle + Math.PI / 6),
              path[last].y - headlen * Math.sin(angle + Math.PI / 6)
            );
            ctx.stroke();
          }
        } else {
          // Q3 & Q4: Arc direct
          ctx.strokeStyle = isActive ? '#3b82f6' : '#93c5fd';
          ctx.lineWidth = (isActive ? 5 : 3) / zoom;
          ctx.beginPath();
          ctx.moveTo(fromPos.x, fromPos.y);
          ctx.lineTo(toPos.x, toPos.y);
          ctx.stroke();
          
          const angle = Math.atan2(toPos.y - fromPos.y, toPos.x - fromPos.x);
          const headlen = 15 / zoom;
          ctx.beginPath();
          ctx.moveTo(toPos.x, toPos.y);
          ctx.lineTo(
            toPos.x - headlen * Math.cos(angle - Math.PI / 6),
            toPos.y - headlen * Math.sin(angle - Math.PI / 6)
          );
          ctx.moveTo(toPos.x, toPos.y);
          ctx.lineTo(
            toPos.x - headlen * Math.cos(angle + Math.PI / 6),
            toPos.y - headlen * Math.sin(angle + Math.PI / 6)
          );
          ctx.stroke();
        }
      }
    }

    // Q3: Dessiner les nœuds numérotés
    patientData.nodes.slice(0, currentStep + 1).forEach((node, idx) => {
      const pos = nodePositions[node.id];
      if (pos) {
        const isCurrent = idx === currentStep;
        
        if (isCurrent && viewMode === 'graph') {
          ctx.fillStyle = 'rgba(239, 68, 68, 0.2)';
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, 30 / zoom, 0, Math.PI * 2);
          ctx.fill();
        }
        
        ctx.fillStyle = isCurrent ? '#ef4444' : (viewMode === 'graph' ? '#3b82f6' : '#10b981');
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3 / zoom;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, (isCurrent ? 14 : 10) / zoom, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        ctx.fillStyle = '#ffffff';
        ctx.font = `bold ${(isCurrent ? 13 : 11) / zoom}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.id.toString(), pos.x, pos.y);
        
        if (viewMode === 'graph') {
          ctx.fillStyle = '#1e293b';
          ctx.font = `bold ${10 / zoom}px Arial`;
          const label = node.label.includes('.') ? node.label.split('.')[1] : node.label;
          ctx.fillText(label, pos.x, pos.y + 25 / zoom);
        }
      }
    });

    ctx.restore();
  }, [currentStep, viewMode, nodePositions, showGrid, zoom, pan]);

  // Q3: Gestion du drag & drop en mode graphe
  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - pan.x) / zoom;
    const y = (e.clientY - rect.top - pan.y) / zoom;
    
    if (viewMode === 'graph') {
      for (let node of patientData.nodes) {
        const pos = nodePositions[node.id];
        if (pos && Math.sqrt((x - pos.x) ** 2 + (y - pos.y) ** 2) < 20) {
          setDraggedNode(node.id);
          return;
        }
      }
    }
    
    setIsPanning(true);
    setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e) => {
    if (draggedNode && viewMode === 'graph') {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left - pan.x) / zoom;
      const y = (e.clientY - rect.top - pan.y) / zoom;
      setNodePositions(prev => ({ ...prev, [draggedNode]: { x, y } }));
    } else if (isPanning) {
      setPan({ x: e.clientX - panStart.x, y: e.clientY - panStart.y });
    }
  };

  const handleMouseUp = () => {
    setDraggedNode(null);
    setIsPanning(false);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const newZoom = zoom * (e.deltaY > 0 ? 0.9 : 1.1);
    setZoom(Math.min(Math.max(newZoom, 0.3), 3));
  };

  const totalDistance = calculateTotalDistance();
  const progress = ((currentStep + 1) / patientData.nodes.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Étude de Cas - Flux Patients Urologie</h1>
              <p className="text-gray-600 mt-1">IMT Mines Albi - Test Recrutement Stage</p>
              <div className="mt-2 text-sm text-gray-500">
                <span className="font-semibold">Patient #{patientData.patient_id}</span> • Durée: {patientData.total_duration_minutes.toFixed(2)} min
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Date: 12/11/2015</div>
              <div className="text-lg font-semibold text-blue-600">Questions 3-4-5</div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="flex items-center gap-2 text-blue-700 mb-1">
                <User size={18} />
                <span className="font-semibold text-sm">Patient ID</span>
              </div>
              <div className="text-xl md:text-2xl font-bold text-blue-900">{patientData.patient_id}</div>
            </div>
            <div className="bg-green-50 rounded-lg p-3">
              <div className="flex items-center gap-2 text-green-700 mb-1">
                <Clock size={18} />
                <span className="font-semibold text-sm">Durée totale</span>
              </div>
              <div className="text-xl md:text-2xl font-bold text-green-900">{patientData.total_duration_minutes.toFixed(0)} min</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-3">
              <div className="flex items-center gap-2 text-purple-700 mb-1">
                <Activity size={18} />
                <span className="font-semibold text-sm">Étapes</span>
              </div>
              <div className="text-xl md:text-2xl font-bold text-purple-900">{patientData.nodes.length}</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-3">
              <div className="flex items-center gap-2 text-orange-700 mb-1">
                <Route size={18} />
                <span className="font-semibold text-sm">Distance</span>
              </div>
              <div className="text-xl md:text-2xl font-bold text-orange-900">{totalDistance} m</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-4 md:p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3">
              <h2 className="text-xl font-bold text-gray-900">
                {viewMode === 'graph' && 'Q3 - Graphe orienté du parcours'}
                {viewMode === 'architectural' && 'Q4 - Plan architectural superposé'}
                {viewMode === 'path' && 'Q5 - Maillage des déplacements'}
              </h2>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => setViewMode('graph')} className={`px-3 py-2 rounded-lg transition text-sm font-semibold ${viewMode === 'graph' ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                  Q3: Graphe
                </button>
                <button onClick={() => setViewMode('architectural')} className={`px-3 py-2 rounded-lg transition text-sm font-semibold ${viewMode === 'architectural' ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                  Q4: Plan
                </button>
                <button onClick={() => setViewMode('path')} className={`px-3 py-2 rounded-lg transition text-sm font-semibold ${viewMode === 'path' ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                  Q5: Maillage
                </button>
                <div className="w-px bg-gray-300 mx-1"></div>
                <button onClick={() => setZoom(z => Math.min(z + 0.2, 3))} className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  <Maximize2 size={18} />
                </button>
                <button onClick={() => setZoom(z => Math.max(z - 0.2, 0.3))} className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  <Maximize2 size={18} className="rotate-180" />
                </button>
                <button onClick={() => { setZoom(0.75); setPan({ x: 50, y: 100 }); }} className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  <Move size={18} />
                </button>
                <div className="w-px bg-gray-300 mx-1"></div>
                <button onClick={() => setIsPlaying(!isPlaying)} className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                </button>
                <button onClick={() => { setCurrentStep(0); setIsPlaying(false); }} className="p-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
                  <RotateCcw size={18} />
                </button>
              </div>
            </div>

            <div className="border-2 border-gray-200 rounded-lg overflow-hidden bg-white" style={{ height: '550px' }}>
              <canvas 
                ref={canvasRef} 
                width={1000} 
                height={900} 
                className="cursor-grab active:cursor-grabbing w-full h-full" 
                onMouseDown={handleMouseDown} 
                onMouseMove={handleMouseMove} 
                onMouseUp={handleMouseUp} 
                onMouseLeave={handleMouseUp} 
                onWheel={handleWheel} 
              />
            </div>

            <div className="mt-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
              <div className="text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Maximize2 size={16} />
                  <span>Zoom: {(zoom * 100).toFixed(0)}%</span>
                  <span className="text-gray-400">•</span>
                  <span>Mode: {viewMode === 'graph' ? 'Graphe' : viewMode === 'architectural' ? 'Plan' : 'Maillage'}</span>
                </div>
                <div className="mt-1 text-gray-500 text-xs">
                  {viewMode === 'path' && `Distance parcourue: ${totalDistance} mètres (sur maillage)`}
                </div>
              </div>
              <div className="w-full md:w-auto">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Étape {currentStep + 1}/{patientData.nodes.length}</span>
                  <span>{progress.toFixed(0)}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300" style={{ width: `${progress}%` }} />
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-start gap-2">
                <Info size={18} className="text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-900">
                  {viewMode === 'graph' && (
                    <div>
                      <strong>Mode Graphe (Q3):</strong> Graphe orienté avec {patientData.nodes.length} nœuds numérotés (1 à {patientData.nodes.length}). 
                      Les nœuds sont <strong>draggables</strong> (glissé-déposé) et les arcs restent <strong>élastiques</strong> (connectés aux nœuds).
                    </div>
                  )}
                  {viewMode === 'architectural' && (
                    <div>
                      <strong>Mode Plan (Q4):</strong> Plan architectural du service Urologie basé sur le plan réel fourni. 
                      Chaque nœud est <strong>centré sur le point de référence</strong> de sa salle (centre de gravité). 
                      <strong>Échelle: 1px = 5cm</strong> (largeur box = 70px = 3,50m).
                    </div>
                  )}
                  {viewMode === 'path' && (
                    <div>
                      <strong>Mode Maillage (Q5):</strong> Les arcs suivent le <strong>maillage des déplacements</strong> (lignes médianes des couloirs). 
                      Basé sur le plan réel: couloir principal horizontal, connexions verticales vers salles de consultation et examens. 
                      <strong>Distance totale: {totalDistance} mètres</strong> (échelle: 1px = 5cm).
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Détails de l'Étape</h2>
            {patientData.nodes[currentStep] && (
              <div className="space-y-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="text-sm text-blue-600 font-semibold mb-1">Étape #{patientData.nodes[currentStep].id}</div>
                  <div className="text-base font-bold text-blue-900 break-words">{patientData.nodes[currentStep].label}</div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded p-3">
                    <div className="text-xs text-gray-500 mb-1">📍 Salle</div>
                    <div className="font-semibold text-gray-900 text-sm">{roomLayout[patientData.nodes[currentStep].room]?.label || patientData.nodes[currentStep].room}</div>
                  </div>
                  <div className="bg-gray-50 rounded p-3">
                    <div className="text-xs text-gray-500 mb-1">⏰ Heure</div>
                    <div className="font-semibold text-gray-900 text-sm">{patientData.nodes[currentStep].timestamp_start?.split(' ')[1] || 'N/A'}</div>
                  </div>
                  {patientData.nodes[currentStep].duration_minutes && (
                    <div className="bg-gray-50 rounded p-3">
                      <div className="text-xs text-gray-500 mb-1">⏱️ Durée</div>
                      <div className="font-semibold text-green-700 text-sm">{patientData.nodes[currentStep].duration_minutes.toFixed(2)} min</div>
                    </div>
                  )}
                  {patientData.nodes[currentStep].staff && (
                    <div className="bg-gray-50 rounded p-3 col-span-2">
                      <div className="text-xs text-gray-500 mb-1">👥 Personnel</div>
                      <div className="font-semibold text-gray-900 text-xs break-words">{patientData.nodes[currentStep].staff}</div>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3 text-sm">Légende</h3>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span>Position actuelle (étape {currentStep + 1})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span>Graphe / Positions visitées</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span>Plan architectural</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-1 bg-blue-400" />
                  <span>Chemin parcouru</span>
                </div>
                {viewMode === 'path' && (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-1 border-t-2 border-dashed border-gray-400" />
                    <span>Réseau de couloirs</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mt-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Chronologie du Parcours</h2>
          <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
            {patientData.nodes.map((node, idx) => (
              <div 
                key={node.id} 
                onClick={() => setCurrentStep(idx)} 
                className={`p-3 rounded-lg cursor-pointer transition ${
                  idx === currentStep 
                    ? 'bg-blue-100 border-2 border-blue-500 shadow-md' 
                    : idx < currentStep 
                      ? 'bg-gray-50 border border-gray-200 hover:bg-gray-100' 
                      : 'bg-white border border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                    idx === currentStep ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-700'
                  }`}>
                    {node.id}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 text-sm truncate">
                      {node.label.includes('.') ? node.label.split('.')[1] : node.label}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      <span>{node.timestamp_start?.split(' ')[1]}</span>
                      {node.duration_minutes && <span className="ml-2">• {node.duration_minutes.toFixed(2)} min</span>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg p-4 md:p-6 mt-6 text-white">
          <h2 className="text-xl md:text-2xl font-bold mb-4">📋 Synthèse des Réponses (Basées sur Plan Réel)</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
              <div className="font-semibold mb-2 text-sm md:text-base">Q1 - Patient séjour le plus long</div>
              <div className="text-2xl md:text-3xl font-bold">Patient #{patientData.patient_id}</div>
              <div className="text-xs opacity-90 mt-1">Identifié à partir du fichier log</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
              <div className="font-semibold mb-2 text-sm md:text-base">Q2 - Temps de séjour</div>
              <div className="text-2xl md:text-3xl font-bold">{patientData.total_duration_minutes.toFixed(2)} min</div>
              <div className="text-xs opacity-90 mt-1">= {(patientData.total_duration_minutes / 60).toFixed(2)} heures</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
              <div className="font-semibold mb-2 text-sm md:text-base">Q5 - Distance parcourue</div>
              <div className="text-2xl md:text-3xl font-bold">{totalDistance} m</div>
              <div className="text-xs opacity-90 mt-1">Sur maillage des déplacements réels</div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
              <div className="font-semibold mb-2 text-sm">Q3 - Graphe orienté</div>
              <div className="text-xs space-y-1">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                  <span>{patientData.nodes.length} nœuds numérotés (1 à {patientData.nodes.length})</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                  <span>Nœuds draggables (glissé-déposé)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                  <span>Arcs élastiques connectés</span>
                </div>
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
              <div className="font-semibold mb-2 text-sm">Q4 - Plan architectural</div>
              <div className="text-xs space-y-1">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                  <span>Positions basées sur plan réel</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                  <span>Nœuds sur points de référence</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                  <span>Échelle: 1px = 5cm (box = 3.50m)</span>
                </div>
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
              <div className="font-semibold mb-2 text-sm">Q5 - Maillage et Distance</div>
              <div className="text-xs space-y-1">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                  <span>Lignes médianes des couloirs</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                  <span>Réseau basé sur plan réel</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                  <span>Distance: {totalDistance} mètres</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-gray-500 text-sm">
          <p className="font-semibold">Étude de cas - IMT Mines Albi - Centre de Génie Industriel</p>
          <p className="mt-1">Données du 12/11/2015 • Service Urologie • Test recrutement stage</p>
          <p className="mt-1 text-xs">Positions et maillage basés sur le plan architectural réel fourni</p>
        </div>
      </div>
    </div>
  );
};

export default PatientFlowVisualization;