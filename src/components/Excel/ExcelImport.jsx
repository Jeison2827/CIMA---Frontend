import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';
import axios from 'axios';
import './ExcelImport.css';  // Asegúrate de que el archivo de estilos está correctamente importado

const ExcelImport = () => {
    const [fileData, setFileData] = useState([]);
    const [fileName, setFileName] = useState('');

    // Configuración de react-dropzone
    const { getRootProps, getInputProps } = useDropzone({
        accept: {
            // Definir las extensiones permitidas y sus MIME types
            'application/vnd.ms-excel': ['.xls'],  // Para archivos .xls
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],  // Para archivos .xlsx
        },
        onDrop: (acceptedFiles) => {
            if (acceptedFiles.length === 0) {
                alert('Formato de archivo no soportado. Solo se aceptan archivos Excel.');
                return;
            }
            const file = acceptedFiles[0];
            setFileName(file.name);
            handleFile(file);
        }
    });

    // Manejar la lectura del archivo Excel
    const handleFile = (file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const binaryStr = e.target.result;
            const workbook = XLSX.read(binaryStr, { type: 'binary' });
            const sheetName = workbook.SheetNames[0]; // Leer la primera hoja
            const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
            setFileData(worksheet);  // Guardar los datos en el estado
        };
        reader.readAsBinaryString(file);
    };

    // Enviar archivo al backend
    const handleSubmit = async () => {
        try {
            await axios.post('http://localhost:3000/upload-excel', { data: fileData });
            alert('Archivo subido y procesado con éxito.');
        } catch (error) {
            alert('Error al subir el archivo.');
        }
    };

    return (
        <div className="excel-import-container">
            <h2>Importar archivo Excel</h2>
            
            {/* Zona de carga de archivos */}
            <div {...getRootProps()} className="dropzone">
                <input {...getInputProps()} />
                <p>Arrastra un archivo o haz clic para seleccionar un archivo Excel (.xls, .xlsx)</p>
            </div>

            {/* Mostrar el nombre del archivo cargado */}
            {fileName && <p>Archivo cargado: {fileName}</p>}

            {/* Mostrar la vista previa de los datos */}
            {fileData.length > 0 && (
                <div className="data-preview">
                    <h3>Vista previa de los datos</h3>
                    <table>
                        <thead>
                            <tr>
                                {Object.keys(fileData[0]).map((key, index) => (
                                    <th key={index}>{key}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {fileData.map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                    {Object.values(row).map((value, colIndex) => (
                                        <td key={colIndex}>{value}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Botón para subir el archivo al backend */}
            <button onClick={handleSubmit} disabled={fileData.length === 0}>
                Subir y procesar archivo
            </button>
        </div>
    );
};

export default ExcelImport;
