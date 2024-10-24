import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';
import './ExcelImport.css';

const ExcelImport = () => {
    const [fileData, setFileData] = useState([]);
    const [fileName, setFileName] = useState('');
    const [fileType, setFileType] = useState('');
    const [error, setError] = useState(null); // Para manejar errores

    // Configuración de react-dropzone para arrastrar y soltar archivos
    const { getRootProps, getInputProps } = useDropzone({
        accept: {
            'application/vnd.ms-excel': ['.xls'],  // Para archivos .xls
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],  // Para archivos .xlsx
        },
        onDrop: (acceptedFiles) => {
            if (acceptedFiles.length === 0) {
                setError('Formato de archivo no soportado. Solo se aceptan archivos Excel.');
                return;
            }
            const file = acceptedFiles[0];
            setFileName(file.name);  // Guardar el nombre del archivo
            setFileType(file.type);  // Guardar el tipo del archivo
            handleFile(file);  // Manejar la lectura del archivo
        }
    });

    // Función para procesar el archivo Excel y extraer los datos
    const handleFile = (file) => {
        const reader = new FileReader();
        
        // Procesar archivo Excel
        reader.onload = (e) => {
            const binaryStr = e.target.result;
            const workbook = XLSX.read(binaryStr, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];  // Leer la primera hoja
            const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);  // Convertir la hoja a JSON
            
            // Validar si hay datos
            if (worksheet.length === 0) {
                setError('El archivo Excel está vacío o no contiene datos legibles.');
            } else {
                setFileData(worksheet);  // Almacenar los datos en el estado
                setError(null);  // Limpiar cualquier error
            }
        };
        reader.readAsBinaryString(file);  // Leer el archivo como binario
    };

    return (
        <div className="excel-import-container">
            <h2>Importar archivo Excel</h2>
            
            {/* Zona de carga de archivos */}
            <div {...getRootProps()} className="dropzone">
                <input {...getInputProps()} />
                <p>Arrastra un archivo o haz clic para seleccionar un archivo (.xls, .xlsx)</p>
            </div>

            {/* Mostrar el nombre del archivo cargado */}
            {fileName && <p>Archivo cargado: {fileName}</p>}

            {/* Mostrar errores si hay */}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {/* Mostrar la vista previa de los datos si es un archivo Excel */}
            {fileData.length > 0 && (
                <div className="data-preview">
                    <h3>Vista previa de los datos (Excel)</h3>
                    <table>
                        <thead>
                            <tr>
                                {/* Mostrar los encabezados de las columnas */}
                                {Object.keys(fileData[0]).map((key, index) => (
                                    <th key={index}>{key}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {/* Mostrar los datos de cada fila */}
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
        </div>
    );
};

export default ExcelImport;
