import { useRef, useState } from "react";
import { Box, HStack } from "@chakra-ui/react";
import { Editor } from "@monaco-editor/react";
import LanguageSelector from "./LanguageSelector";
import { CODE_SNIPPETS } from "../constants";
import Output from "./Output";
import apiClient from '../services/apiClient';
import { Button } from "@chakra-ui/react";

const CodeEditor = () => {
  const editorRef = useRef();
  const [value, setValue] = useState('print("Hello, world!")');
  const [output, setOutput] = useState("")
  const [language, setLanguage] = useState("python");

  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  const onSelect = (language) => {
    setLanguage(language);
    setValue(CODE_SNIPPETS[language]);
  };

  const onEditorValueChange = (val) => {
    setValue(val)
  }

  const executeCode = async () => {
    try {
      const response = await apiClient.post('/api/execute/', { code: value });
      setOutput(response.data.result)
      console.log(response.data)
      return response.data;
      
    } catch (error) {
      console.error('Error executing code:', error);
      throw error;
    }
  };

  return (
    <Box>
      <HStack spacing={4}>
        <Box w="50%">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <LanguageSelector language={language} onSelect={onSelect} />
                <Button
                    variant="outline"
                    colorScheme="green"
                    mb={4}
                    onClick={executeCode}
                >
                    Run Code
                </Button>
            </div>
          
          <Editor
            options={{
              minimap: {
                enabled: false,
              },
            }}
            height="75vh"
            theme="vs-dark"
            language={language}
            onMount={onMount}
            value={value}
            onChange={(value) => onEditorValueChange(value)}
          />
        </Box>
        <Output editorRef={editorRef} language={language} output={output}/>
      </HStack>
    </Box>
  );
};
export default CodeEditor;