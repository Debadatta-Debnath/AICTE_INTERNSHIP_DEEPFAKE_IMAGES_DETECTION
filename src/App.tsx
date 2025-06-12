import React, { useState, useRef, useEffect } from 'react';
import { Upload, FileText, Image, Eye, AlertCircle, CheckCircle, Loader2, Download, Trash2, Sparkles, Zap, Brain } from 'lucide-react';

interface AnalysisResult {
  isOriginal: boolean;
  confidence: number;
  processedImageUrl?: string;
  processingTime: number;
}

interface UploadedModel {
  file: File;
  name: string;
  size: string;
  uploadedAt: Date;
}

interface UploadedImage {
  file: File;
  url: string;
  name: string;
  size: string;
}

function App() {
  const [model, setModel] = useState<UploadedModel | null>(null);
  const [image, setImage] = useState<UploadedImage | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<'model' | 'image' | null>(null);
  const [showResult, setShowResult] = useState(false);

  const modelInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (result) {
      const timer = setTimeout(() => setShowResult(true), 100);
      return () => clearTimeout(timer);
    } else {
      setShowResult(false);
    }
  }, [result]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleModelUpload = (file: File) => {
    if (!file.name.toLowerCase().endsWith('.pt')) {
      setError('Please upload a valid PyTorch model file (.pt)');
      return;
    }
    
    setModel({
      file,
      name: file.name,
      size: formatFileSize(file.size),
      uploadedAt: new Date()
    });
    setError(null);
  };

  const handleImageUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file');
      return;
    }

    const url = URL.createObjectURL(file);
    setImage({
      file,
      url,
      name: file.name,
      size: formatFileSize(file.size)
    });
    setError(null);
    setResult(null);
  };

  const handleDrop = (e: React.DragEvent, type: 'model' | 'image') => {
    e.preventDefault();
    setDragOver(null);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      if (type === 'model') {
        handleModelUpload(files[0]);
      } else {
        handleImageUpload(files[0]);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDragEnter = (e: React.DragEvent, type: 'model' | 'image') => {
    e.preventDefault();
    setDragOver(type);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(null);
  };

  const runAnalysis = async () => {
    if (!model || !image) return;

    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      // Simulate processing time with realistic delay
      await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));
      
      // Mock analysis result
      const mockResult: AnalysisResult = {
        isOriginal: Math.random() > 0.5,
        confidence: 0.75 + Math.random() * 0.24, // 75-99% confidence
        processingTime: 1.2 + Math.random() * 2.3 // 1.2-3.5 seconds
      };

      setResult(mockResult);
    } catch (err) {
      setError('Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearModel = () => {
    setModel(null);
    setResult(null);
    if (modelInputRef.current) {
      modelInputRef.current.value = '';
    }
  };

  const clearImage = () => {
    if (image) {
      URL.revokeObjectURL(image.url);
    }
    setImage(null);
    setResult(null);
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="relative bg-white/10 backdrop-blur-md border-b border-white/20 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center space-x-4 animate-fade-in">
            <div className="relative">
              <div className="w-14 h-14 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-2xl transform hover:scale-110 transition-all duration-300">
                <Brain className="w-8 h-8 text-white animate-pulse" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-ping"></div>
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-1 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                AI Vision Analysis Suite
              </h1>
              <p className="text-blue-200 flex items-center space-x-2">
                <Sparkles className="w-4 h-4 animate-pulse" />
                <span>Advanced PyTorch-powered occlusion sensitivity detection</span>
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-2 bg-white/10 rounded-full px-4 py-2 backdrop-blur-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-white/80 text-sm">AI Ready</span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center space-x-3 backdrop-blur-sm animate-slide-down shadow-lg">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 animate-pulse" />
            <p className="text-red-300">{error}</p>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-400 hover:text-red-300 transition-all duration-200 hover:scale-110"
            >
              ×
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Model Upload */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:bg-white/15 animate-fade-in-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-white" />
                </div>
                <span>PyTorch Model</span>
                <Zap className="w-4 h-4 text-yellow-400 animate-pulse" />
              </h2>
              {model && (
                <button
                  onClick={clearModel}
                  className="text-red-400 hover:text-red-300 transition-all duration-200 hover:scale-110 hover:rotate-12"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>

            {!model ? (
              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                  dragOver === 'model'
                    ? 'border-blue-400 bg-blue-500/20 scale-105 shadow-2xl'
                    : 'border-white/30 hover:border-white/50 hover:bg-white/5'
                }`}
                onDrop={(e) => handleDrop(e, 'model')}
                onDragOver={handleDragOver}
                onDragEnter={(e) => handleDragEnter(e, 'model')}
                onDragLeave={handleDragLeave}
              >
                <div className="relative">
                  <Upload className="w-16 h-16 text-white/60 mx-auto mb-4 animate-bounce" />
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-400/50 rounded-full animate-ping"></div>
                </div>
                <p className="text-white/80 mb-2 text-lg font-medium">Drop your .pt model file here</p>
                <p className="text-white/60 text-sm mb-6">or click to browse</p>
                <button
                  onClick={() => modelInputRef.current?.click()}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl font-semibold"
                >
                  Choose File
                </button>
                <input
                  ref={modelInputRef}
                  type="file"
                  accept=".pt"
                  onChange={(e) => e.target.files?.[0] && handleModelUpload(e.target.files[0])}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="bg-white/5 rounded-xl p-6 border border-white/10 animate-slide-in shadow-inner">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg animate-pulse">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-semibold text-lg">{model.name}</p>
                    <p className="text-white/60">{model.size}</p>
                    <p className="text-white/60 text-sm flex items-center space-x-1">
                      <span>Uploaded {model.uploadedAt.toLocaleTimeString()}</span>
                      <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse ml-2"></div>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Image Upload */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:bg-white/15 animate-fade-in-up delay-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <Image className="w-4 h-4 text-white" />
                </div>
                <span>Test Image</span>
                <Eye className="w-4 h-4 text-cyan-400 animate-pulse" />
              </h2>
              {image && (
                <button
                  onClick={clearImage}
                  className="text-red-400 hover:text-red-300 transition-all duration-200 hover:scale-110 hover:rotate-12"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>

            {!image ? (
              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                  dragOver === 'image'
                    ? 'border-cyan-400 bg-cyan-500/20 scale-105 shadow-2xl'
                    : 'border-white/30 hover:border-white/50 hover:bg-white/5'
                }`}
                onDrop={(e) => handleDrop(e, 'image')}
                onDragOver={handleDragOver}
                onDragEnter={(e) => handleDragEnter(e, 'image')}
                onDragLeave={handleDragLeave}
              >
                <div className="relative">
                  <Image className="w-16 h-16 text-white/60 mx-auto mb-4 animate-bounce delay-200" />
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-cyan-400/50 rounded-full animate-ping delay-200"></div>
                </div>
                <p className="text-white/80 mb-2 text-lg font-medium">Drop your image here</p>
                <p className="text-white/60 text-sm mb-6">or click to browse</p>
                <button
                  onClick={() => imageInputRef.current?.click()}
                  className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white px-8 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl font-semibold"
                >
                  Choose Image
                </button>
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="space-y-4 animate-slide-in">
                <div className="bg-white/5 rounded-xl p-4 border border-white/10 shadow-inner">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg animate-pulse">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-semibold">{image.name}</p>
                      <p className="text-white/60 text-sm">{image.size}</p>
                    </div>
                  </div>
                  <div className="relative overflow-hidden rounded-xl group">
                    <img
                      src={image.url}
                      alt="Uploaded image"
                      className="w-full h-40 object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Analysis Button */}
        <div className="text-center mb-8">
          <button
            onClick={runAnalysis}
            disabled={!model || !image || isAnalyzing}
            className={`relative px-12 py-5 rounded-2xl font-bold text-xl transition-all duration-500 transform ${
              model && image && !isAnalyzing
                ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white shadow-2xl hover:shadow-3xl hover:scale-110 animate-pulse-glow'
                : 'bg-white/10 text-white/50 cursor-not-allowed'
            }`}
          >
            {isAnalyzing ? (
              <div className="flex items-center space-x-3">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span>Analyzing Image...</span>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Brain className="w-6 h-6" />
                <span>Run AI Analysis</span>
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>
            )}
            {model && image && !isAnalyzing && (
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 opacity-0 hover:opacity-20 transition-opacity duration-300"></div>
            )}
          </button>
        </div>

        {/* Results */}
        {result && (
          <div className={`bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8 shadow-2xl transition-all duration-1000 ${
            showResult ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <h2 className="text-2xl font-bold text-white mb-8 flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <span>Analysis Results</span>
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-100"></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-200"></div>
              </div>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Classification Result */}
              <div className={`bg-white/5 rounded-2xl p-8 text-center border border-white/10 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 ${
                showResult ? 'animate-fade-in-up' : ''
              }`}>
                <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-500 ${
                  result.isOriginal ? 'bg-gradient-to-r from-green-500 to-emerald-500 animate-pulse-green' : 'bg-gradient-to-r from-amber-500 to-orange-500 animate-pulse-amber'
                }`}>
                  {result.isOriginal ? (
                    <CheckCircle className="w-10 h-10 text-white" />
                  ) : (
                    <AlertCircle className="w-10 h-10 text-white" />
                  )}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Classification</h3>
                <p className={`text-2xl font-bold ${
                  result.isOriginal ? 'text-green-400' : 'text-amber-400'
                }`}>
                  {result.isOriginal ? 'Original Image' : 'Occlusion Map'}
                </p>
                <div className={`mt-4 h-1 rounded-full ${
                  result.isOriginal ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-amber-500 to-orange-500'
                } animate-pulse`}></div>
              </div>

              {/* Confidence Score */}
              <div className={`bg-white/5 rounded-2xl p-8 text-center border border-white/10 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 ${
                showResult ? 'animate-fade-in-up delay-100' : ''
              }`}>
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-2xl animate-pulse-blue">
                  <Eye className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Confidence</h3>
                <p className="text-4xl font-bold text-blue-400 mb-4">
                  {(result.confidence * 100).toFixed(1)}%
                </p>
                <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full transition-all duration-2000 ease-out animate-shimmer"
                    style={{ width: `${result.confidence * 100}%` }}
                  />
                </div>
              </div>

              {/* Processing Time */}
              <div className={`bg-white/5 rounded-2xl p-8 text-center border border-white/10 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 ${
                showResult ? 'animate-fade-in-up delay-200' : ''
              }`}>
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl animate-pulse-purple">
                  <Zap className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Processing Time</h3>
                <p className="text-4xl font-bold text-purple-400 mb-4">
                  {result.processingTime.toFixed(1)}s
                </p>
                <div className="flex justify-center space-x-1">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>

            {/* Additional Details */}
            <div className={`mt-8 bg-white/5 rounded-2xl p-6 border border-white/10 shadow-inner ${
              showResult ? 'animate-fade-in-up delay-300' : ''
            }`}>
              <h4 className="text-white font-bold mb-4 flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-yellow-400" />
                <span>Analysis Details</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  <span className="text-white/60">Model:</span>
                  <span className="text-white font-medium">{model?.name}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-100"></div>
                  <span className="text-white/60">Image:</span>
                  <span className="text-white font-medium">{image?.name}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse delay-200"></div>
                  <span className="text-white/60">Result:</span>
                  <span className={`font-medium ${result.isOriginal ? 'text-green-400' : 'text-amber-400'}`}>
                    {result.isOriginal ? 'Original content detected' : 'Occlusion sensitivity map detected'}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-300"></div>
                  <span className="text-white/60">Timestamp:</span>
                  <span className="text-white font-medium">{new Date().toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;