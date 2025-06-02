
import React from 'react';
import ApiKeyForm from '../ApiKeyForm';

const ApiKeyBanner = () => {
  return (
    <div className="bg-muted/50 p-4 flex items-center justify-between">
      <p className="text-sm text-muted-foreground">
        Using mock responses. For full AI capabilities, please set your OpenAI API key.
      </p>
      <ApiKeyForm />
    </div>
  );
};

export default ApiKeyBanner;
