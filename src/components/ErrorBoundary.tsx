/**
 * 错误边界组件
 * 用于捕获3D场景中的错误，防止整个应用崩溃
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  retryCount: number;
}

class ErrorBoundary extends Component<Props, State> {
  private maxRetries = 3;
  private DEBUG = import.meta.env.DEV && import.meta.env.VITE_DEBUG_LOGS === 'true';
  
  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false, 
      retryCount: 0 
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // 更新 state 使下一次渲染能够显示降级后的 UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // 记录错误信息
    this.setState({ errorInfo });
    
    // 调用外部错误处理函数
    this.props.onError?.(error, errorInfo);
    
    // 详细的错误日志（仅在调试模式下输出）
    if (this.DEBUG) {
      console.group('🚨 ErrorBoundary caught an error');
      console.error('Error:', error);
      console.error('Error Info:', errorInfo);
      console.error('Component Stack:', errorInfo.componentStack);
      console.groupEnd();
    }
  }

  handleRetry = () => {
    if (this.state.retryCount < this.maxRetries) {
      this.setState(prevState => ({
        hasError: false,
        error: undefined,
        errorInfo: undefined,
        retryCount: prevState.retryCount + 1
      }));
    } else {
      if (this.DEBUG) console.warn('Maximum retry attempts reached');
    }
  };

  handleReset = () => {
    this.setState({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
      retryCount: 0
    });
  };

  render() {
    if (this.state.hasError) {
      // 自定义降级后的 UI
      return (
        this.props.fallback || (
          <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-900 via-red-900/20 to-gray-900 text-white">
            <div className="text-center p-8 max-w-md mx-auto">
              <div className="mb-6">
                <div className="text-6xl mb-4">⚠️</div>
                <h2 className="text-2xl font-bold mb-2 text-red-400">3D场景渲染错误</h2>
                <p className="text-gray-300 text-sm mb-4">
                  {this.state.error?.message || '发生了未知的渲染错误'}
                </p>
              </div>
              
              <div className="space-y-3">
                {this.state.retryCount < this.maxRetries ? (
                  <button
                    onClick={this.handleRetry}
                    className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors font-medium"
                  >
                    重试 ({this.state.retryCount + 1}/{this.maxRetries})
                  </button>
                ) : (
                  <div className="text-yellow-400 text-sm mb-2">
                    已达到最大重试次数
                  </div>
                )}
                
                <button
                  onClick={this.handleReset}
                  className="w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded transition-colors font-medium"
                >
                  重置场景
                </button>
                
                <button
                  onClick={() => window.location.reload()}
                  className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 rounded transition-colors font-medium"
                >
                  刷新页面
                </button>
              </div>
              
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mt-4 text-left">
                  <summary className="cursor-pointer text-gray-400 text-sm hover:text-white">
                    查看错误详情
                  </summary>
                  <pre className="mt-2 p-3 bg-black/50 rounded text-xs text-red-300 overflow-auto max-h-32">
                    {this.state.error.stack}
                  </pre>
                </details>
              )}
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;